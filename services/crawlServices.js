const { fetchPageContent, extractLinks } = require("./scrapflyServices");
const { getDomain } = require("../utils/getDomain");
const { CrawlQueue } = require("../utils/queueManager");
const { connectToDatabase } = require("../utils/db");

const USER_CRAWL_LIMITS = {
  basic: { pagesPerMonth: 20000, maxDepth: 2 },
  standard: { pagesPerMonth: 50000, maxDepth: 4 },
  pro: { pagesPerMonth: 100000, maxDepth: 6 },
};

async function crawlWebsite(startUrl, userId, ws) {
  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");
  const crawlsCollection = db.collection("crawls");

  const user = await usersCollection.findOne({ _id: userId });
  if (!user || !user.subscription || !user.subscription.plan) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Invalid user or no active plan.",
      })
    );
    return;
  }

  const { plan } = user.subscription;
  const { pagesPerMonth, maxDepth } = USER_CRAWL_LIMITS[plan] || {};

  if (!pagesPerMonth || !maxDepth) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Subscription plan not recognized.",
      })
    );
    return;
  }

  const userCrawlStats = await crawlsCollection.findOne({ userId });
  const pagesCrawled = userCrawlStats?.pagesCrawled || 0;

  if (pagesCrawled >= pagesPerMonth) {
    ws.send(
      JSON.stringify({
        type: "limitReached",
        message: "Monthly crawl limit reached.",
      })
    );
    return;
  }

  const domain = getDomain(startUrl);
  const queue = new CrawlQueue(maxDepth);
  queue.add(startUrl, 0);

  let crawledPages = pagesCrawled;
  let totalPages = 1;

  async function processQueue() {
    if (queue.isEmpty() || crawledPages >= pagesPerMonth) {
      ws.send(
        JSON.stringify({
          type: "crawlComplete",
          message: "Crawl finished",
          crawledPages,
        })
      );
      return;
    }

    const { url, depth } = queue.next();
    ws.send(
      JSON.stringify({
        type: "crawlProgress",
        url,
        crawledPages,
        depth,
        totalPages,
      })
    );
    console.log(`Crawling: ${url} (Depth: ${depth})`);

    try {
      const html = await fetchPageContent(url);
      if (html) {
        const links = extractLinks(html, domain);
        links.forEach((link) => {
          queue.add(link, depth + 1);
          totalPages++;
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
    }

    crawledPages++;
    await crawlsCollection.updateOne(
      { userId },
      { $set: { lastCrawledAt: new Date() }, $inc: { pagesCrawled: 1 } },
      { upsert: true }
    );

    const progress = ((crawledPages / totalPages) * 100).toFixed(2);
    ws.send(
      JSON.stringify({
        type: "crawlProgress",
        url,
        crawledPages,
        totalPages,
        progress,
      })
    );

    setTimeout(processQueue, 100); // Prevents blocking event loop
  }

  processQueue();
}

module.exports = { crawlWebsite };
