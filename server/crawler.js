const { chromium } = require("playwright");
const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../utils/db");
const { debounce } = require("../utils/helpers");
const { runSeoChecks } = require("../services/seo/seoRuleEngine");
const { siteWideChecks, pageLevelChecks } = require("../constants/index");
const {
  extractSEOData,
  extractExtraSeoData,
  extractLinks,
} = require("../utils/seoData.js");
const { ensureValidUrl, normalizeUrl } = require("../utils/urlValidator.js");
const { getLighthouseSummary } = require("../services/lighthouse.js");

async function getUser(userId) {
  const { db } = await connectToDatabase();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!user) throw new Error("User not found!");

  return user;
}

// async function getUserPlan(userId) {
//   const { db } = await connectToDatabase();
//   const user = await db
//     .collection("users")
//     .findOne({ _id: new ObjectId(userId) });
//   if (!user) {
//     throw new Error("User not found in DB");
//   }
//   return user.plan || "basic";
// }

function getRootDomain(hostname) {
  const parts = hostname.split(".");
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join(".");
}

async function crawlPage(url, browser, options) {
  console.log("Reached crawlPage with:", url);

  const {
    ws,
    perWebsitePageLimit,
    counter,
    sendUpdateDebounced,
    cleanPages,
    issuesWithPage,
    rootUrl,
    visitedUrls,
    rootDomain,
    browserContext,
    crawlId,
  } = options;

  const validatedUrl = ensureValidUrl(url);
  if (!validatedUrl) {
    console.warn(`[SKIP] Skipping invalid URL: ${url}`);
    return;
  }

  const normalizedUrl = normalizeUrl(validatedUrl);
  if (!normalizedUrl) {
    console.warn(`[SKIP] Could not normalize URL: ${validatedUrl}`);
    return;
  }

  const currentHostname = new URL(normalizedUrl).hostname;
  const currentDomain = getRootDomain(currentHostname);

  // Skip external domains
  if (currentDomain !== rootDomain) {
    console.log(`[SKIP] External domain skipped: ${normalizedUrl}`);
    return;
  }

  // Skip already visited or over crawl limit
  if (visitedUrls.has(normalizedUrl)) {
    console.log(`[SKIP] Already visited: ${normalizedUrl}`);
    return;
  }

  visitedUrls.add(normalizedUrl);
  counter.count++;
  cleanPages.push(normalizedUrl); // ✅ Save visited page
  console.log(`Crawling: ${normalizedUrl}`);

  let content;
  let page;

  try {
    page = await browserContext.newPage();

    await page.goto(normalizedUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    content = await page.content();

    const seoData = extractSEOData(content, normalizedUrl);
    const extraSeoData = await extractExtraSeoData(page);
    const finalData = {
      ...seoData,
      ...extraSeoData,
    };

    const isStartPage = normalizedUrl === rootUrl;
    const checks = isStartPage ? siteWideChecks : pageLevelChecks;
    const seoCheckResults = runSeoChecks(finalData, checks);

    const allChecks = Object.values(seoCheckResults).flat();
    const issuesForPage = allChecks.filter(
      (check) => check.pass === false || check.pass === null
    );

    console.log(`Found ${issuesForPage.length} issues at ${normalizedUrl}`);
    if (issuesForPage.length > 0) {
      issuesWithPage.push({
        url: normalizedUrl,
        issues: issuesForPage,
      });

      if (ws?.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            type: "issue",
            data: {
              url: normalizedUrl,
              issues: issuesForPage,
              siteWideChecks,
              pageLevelChecks,
              finalData,
            },
          })
        );
      }
    }

    if (ws?.readyState === ws.OPEN && sendUpdateDebounced) {
      sendUpdateDebounced(
        JSON.stringify({
          type: "progress",
          data: finalData,
          seoCheckResults,
        })
      );
    }

    // Extract and follow internal links
    const links = extractLinks(content, normalizedUrl, visitedUrls);
    const blockedKeywords = [
      "login",
      "signin",
      "logout",
      "signup",
      "register",
      "account",
      "auth",
      "sessionid=",
      "cart",
      "checkout",
      "password",
      "track",
      "order",
      "wishlist",
      "add-to-cart",
      "preferences",
      "settings",
      "help",
      "support",
      "feedback",
      "subscribe",
      "utm_",
    ];

    for (let link of links) {
      if (counter.count >= perWebsitePageLimit) {
        console.log(
          `[LIMIT STOP] Limit of ${perWebsitePageLimit} pages reached. Stopping further crawl.`
        );
        if (ws?.readyState === ws.OPEN) {
          ws.send(
            JSON.stringify({
              type: "limit_reached",
              message: `Crawl limit of ${perWebsitePageLimit} pages reached.`,
              totalPages: counter.count,
            })
          );
        }
        break;
      }

      const cleanLink = ensureValidUrl(link);
      if (!cleanLink) continue;

      const normalizedLink = normalizeUrl(cleanLink);
      if (!normalizedLink) continue;

      const lowerLink = normalizedLink.toLowerCase();
      const shouldSkip = blockedKeywords.some((keyword) =>
        lowerLink.includes(keyword)
      );
      if (shouldSkip) {
        console.log(`[SKIP KEYWORD] ${normalizedLink}`);
        continue;
      }

      try {
        const linkDomain = getRootDomain(new URL(normalizedLink).hostname);
        if (linkDomain !== rootDomain) {
          console.log(`[SKIP EXTERNAL LINK] ${normalizedLink}`);
          continue;
        }

        if (visitedUrls.has(normalizedLink)) {
          continue;
        }

        await crawlPage(normalizedLink, browser, {
          ...options,
          rootUrl,
          rootDomain,
        });
      } catch (err) {
        console.warn(`[SKIP LINK] Invalid or malformed link: ${link}`);
        continue;
      }
    }
  } catch (error) {
    console.error(`[ERROR] Failed to crawl ${normalizedUrl}: ${error.message}`);
    if (ws?.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "error",
          data: {
            url: normalizedUrl,
            message: error.message,
          },
        })
      );
    }
  } finally {
    if (page) await page.close();
  }

  if (counter.count === visitedUrls.size) {
    const { db } = await connectToDatabase();
    await db.collection("crawls").updateOne(
      { _id: new ObjectId(crawlId) },
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
        },
      }
    );

    if (ws?.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "done",
          data: {
            message: "Crawl completed.",
            totalPages: counter.count,
            issues: issuesWithPage,
          },
        })
      );
    }
  }

  return {
    crawledPages: cleanPages,
    issuesWithPage,
  };
}

//  Exported entry point function to call from WebSocket handler
async function startCrawl({ startUrl, userId, ws }) {
  console.log("startCrawl called with:", startUrl);

  const { db } = await connectToDatabase();
  const useProxy = false; // Toggle this to false if you want to disable it

  const proxyOptions = useProxy
    ? {
        server: "http://51.158.68.133:8811", // free French proxy (no auth)
      }
    : undefined;

  const browser = await chromium.launch({
    headless: true,
    proxy: proxyOptions,
    args: [
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-extensions",
      "--disable-infobars",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync",
      "--metrics-recording-only",
      "--mute-audio",
    ],
  });

  const counter = { count: 0 };
  const visitedUrls = new Set();

  const user = await getUser(userId);
  const crawlLimit = user?.crawlLimits;

  if (user.isCrawling) {
    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "error",
          message:
            "A crawl is already in progress. Please wait for it to finish.",
        })
      );
    }
    await browser.close();
    return;
  }

  // ✅ Mark crawl in progress
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { isCrawling: true } });

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  // 🔄 Reset crawl usage if new month
  if (user.crawlUsage?.month !== monthKey) {
    user.crawlUsage = { month: monthKey, websitesCrawled: 0, pagesCrawled: 0 };
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "crawlUsage.month": monthKey,
          "crawlUsage.websitesCrawled": 0,
          "crawlUsage.pagesCrawled": 0,
        },
      }
    );
  }

  const currentUsage = user.crawlUsage.websitesCrawled;
  const monthlyWebsiteLimit = crawlLimit?.monthlyWebsiteLimit;
  const perWebsitePageLimit = crawlLimit?.perWebsitePageLimit;

  if (currentUsage >= monthlyWebsiteLimit) {
    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "limit_reached",
          message: `You’ve reached your monthly crawl limit (${monthlyWebsiteLimit})`,
        })
      );
    }

    await browser.close();
    return;
  }

  // ✅ Debounced WebSocket updates
  const sendUpdateDebounced = debounce((message) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }, 300);

  const cleanPages = [];
  const issuesWithPage = [];
  const rootDomain = getRootDomain(new URL(startUrl).hostname);

  const browserContext = await browser.newContext();

  await browserContext.route("**/*", (route) => {
    const request = route.request();
    const resourceType = request.resourceType();

    if (
      ["image", "media", "font", "stylesheet"].includes(resourceType) ||
      request.url().endsWith(".css") ||
      request.url().endsWith(".jpg") ||
      request.url().endsWith(".png") ||
      request.url().endsWith(".woff2")
    ) {
      route.abort();
    } else {
      route.continue();
    }
  });

  const options = {
    ws,
    userId,
    perWebsitePageLimit,
    counter,
    sendUpdateDebounced,
    cleanPages,
    issuesWithPage,
    visitedUrls,
    rootUrl: startUrl,
    rootDomain,
    browserContext,
  };

  try {
    await crawlPage(startUrl, browser, options);

    // ✅ Save crawl log
    await db.collection("crawl_logs").insertOne({
      userId,
      startUrl,
      crawledAt: new Date(),
      pagesCrawled: counter.count,
      issuesFound: issuesWithPage.length,
      urls: cleanPages,
    });

    // ✅ Update crawl usage counts
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "crawlUsage.month": monthKey,
        },
        $inc: {
          "crawlUsage.websitesCrawled": 1,
          "crawlUsage.pagesCrawled": counter.count,
        },
      }
    );

    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "done",
          message: "Crawl completed successfully.",
          data: {
            pagesCrawled: counter.count,
            issuesFound: issuesWithPage.length,
          },
        })
      );
    }
  } catch (err) {
    console.error("Crawler error:", err);
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "error", message: err.message }));
    }
  } finally {
    await browser.close();

    try {
      const lighthouseSummary = await getLighthouseSummary(startUrl);

      const newCrawlData = {
        userId,
        startUrl,
        // pages: [...],
        lighthouse: lighthouseSummary,
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("crawls").insertOne(newCrawlData);
    } catch (err) {
      console.error("Failed to fetch Lighthouse summary:", err.message);
    }

    // Always reset crawl state
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { isCrawling: false } }
      );
  }
}

module.exports = {
  crawlPage,
  startCrawl,
  extractSEOData,
};
