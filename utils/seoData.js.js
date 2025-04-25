const cheerio = require("cheerio");

async function extractSEOData(html, url) {
  const $ = cheerio.load(html);

  const hostname = new URL(url).hostname;
  const h1s = $("h1");
  const h2toh6 = $("h2, h3, h4, h5, h6");
  const images = $("img");
  const canonical = $('link[rel="canonical"]').attr("href") || null;

  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || null;
  const robotsMeta = $('meta[name="robots"]').attr("content") || "";
  const xRobotsHeader =
    $('meta[http-equiv="X-Robots-Tag"]').attr("content") || "";

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).length;

  return {
    url,
    // On-Page
    title: $("title").text().trim() || null,
    metaDescription,
    h1: h1s.first().text().trim() || null,
    h1Count: h1s.length,
    h2toh6Count: h2toh6.length,
    keywordUsage: bodyText, // For evaluator matching
    wordCount,
    altTags: images.map((i, el) => $(el).attr("alt") || "").get(),
    hasCanonical: Boolean(canonical),
    canonicalUrl: canonical,
    noindexMeta: robotsMeta.toLowerCase().includes("noindex"),
    noindexHeader: xRobotsHeader.toLowerCase().includes("noindex"),
    hasSSL: url.startsWith("https://"),
    hasAnalytics:
      $("script[src*='analytics'], script:contains('gtag')").length > 0,
    hasRobotsTxt: url.endsWith("/robots.txt"), // Optional refinement
    hreflang: $('link[rel="alternate"][hreflang]').length > 0,
    langAttr: $("html").attr("lang") || null,

    // Links
    totalLinks: $("a").length,
    internalLinks: $(`a[href^='/'], a[href*='${hostname}']`).length,
    externalLinks: $(`a[href^='http']:not([href*='${hostname}'])`).length,
    hasKeywordInURL: (keyword) =>
      url.toLowerCase().includes(keyword.toLowerCase()),

    // Social
    hasOpenGraph: $("meta[property^='og:']").length > 0,
    hasTwitterCard: $("meta[name='twitter:card']").length > 0,
    hasFacebookPage: $("a[href*='facebook.com']").length > 0,
    hasInstagram: $("a[href*='instagram.com']").length > 0,
    hasTwitter: $("a[href*='twitter.com']").length > 0,
    hasYoutube: $("a[href*='youtube.com']").length > 0,
    hasLinkedIn: $("a[href*='linkedin.com']").length > 0,

    // Performance & Usability
    hasMobileViewport: $("meta[name='viewport']").length > 0,
    isMobileFriendly:
      $("meta[name='viewport']")
        .attr("content")
        ?.includes("width=device-width") || false,
    hasFlash: $("object[type='application/x-shockwave-flash']").length > 0,
    hasIframes: $("iframe").length > 0,
    hasAMP: $("link[rel='amphtml']").length > 0,

    // Sitemap flag
    hasXMLSitemap: html.toLowerCase().includes("sitemap"),
  };
}

async function extractExtraSeoData(page) {
  const extraData = await page.evaluate(() => {
    const getMeta = (name) => {
      const meta = document.querySelector(`meta[name="${name}"]`);
      return meta?.content?.trim() || null;
    };

    const allImages = Array.from(document.querySelectorAll("img"));
    const imagesWithAlt = allImages.filter((img) =>
      img.getAttribute("alt")?.trim()
    );

    const imagesAltText = imagesWithAlt
      .map((img) => img.getAttribute("alt"))
      .join(" ");

    const anchors = Array.from(document.querySelectorAll("a"));
    const hasGoogleBusinessProfile = anchors.some((a) =>
      a.href.includes("google.com/maps/place")
    );

    const html = document.documentElement.innerHTML;

    return {
      metaRobotsTag: getMeta("robots"),
      imagesWithAlt: imagesWithAlt.length,
      imagesAltText,
      hasAddress:
        /(?:\d{1,5}\s+[\w\s]+(?:Street|St|Ave|Avenue|Blvd|Road|Rd|Lane|Ln|Drive|Dr)\b)/i.test(
          html
        ),
      hasPhone: /(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/.test(html),
      hasLocalBusinessSchema: html.includes('"@type":"LocalBusiness"'),
      hasGoogleBusinessProfile,
    };
  });

  const response = await page.goto(page.url(), {
    waitUntil: "domcontentloaded",
  });

  const headers = response.headers();
  const noindexHeader =
    headers["x-robots-tag"]?.toLowerCase().includes("noindex") || false;

  return {
    ...extraData,
    noindexHeader,
    googleBusinessProfileCompleteness: extraData.hasGoogleBusinessProfile
      ? 80
      : 0,
    googleReviewsCount: 0, // You can integrate Google Maps API later
  };
}

function extractLinks(html, baseUrl, visitedUrls) {
  const $ = cheerio.load(html);
  const links = [];

  $("a").each((_, el) => {
    let href = $(el).attr("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("javascript:")
    ) {
      return;
    }

    try {
      if (href.startsWith("/")) {
        href = new URL(href, baseUrl).href;
      } else if (!href.startsWith("http")) {
        return;
      }
    } catch (err) {
      console.warn(`[WARN] Skipping invalid href: ${href}`);
      return;
    }

    if (!visitedUrls.has(href)) {
      links.push(href);
    }
  });

  return links;
}

module.exports = { extractExtraSeoData, extractSEOData, extractLinks };
