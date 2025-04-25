// import fetch from "node-fetch";

const apiKey = process.env.LIGHTHOUSE_API_KEY;

async function getLighthouseSummary(url) {
  if (!url) throw new Error("URL is required");

  async function fetchLighthouseData(strategy) {
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
      )}&strategy=${strategy}&key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google PageSpeed API error (${strategy}): ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  function extractScores(data) {
    const categories = data.lighthouseResult?.categories || {};
    return {
      performance: categories.performance?.score
        ? categories.performance.score * 100
        : null,
      accessibility: categories.accessibility?.score
        ? categories.accessibility.score * 100
        : null,
      bestPractices: categories["best-practices"]?.score
        ? categories["best-practices"].score * 100
        : null,
      seo: categories.seo?.score ? categories.seo.score * 100 : null,
      pwa: categories.pwa?.score ? categories.pwa.score * 100 : null,
    };
  }

  function extractMetrics(data) {
    const audits = data.lighthouseResult?.audits || {};
    return {
      largestContentfulPaint: {
        display: audits["largest-contentful-paint"]?.displayValue || "N/A",
        numeric: audits["largest-contentful-paint"]?.numericValue || null,
      },
      firstContentfulPaint: {
        display: audits["first-contentful-paint"]?.displayValue || "N/A",
        numeric: audits["first-contentful-paint"]?.numericValue || null,
      },
      timeToInteractive: {
        display: audits["interactive"]?.displayValue || "N/A",
        numeric: audits["interactive"]?.numericValue || null,
      },
      cumulativeLayoutShift: {
        display: audits["cumulative-layout-shift"]?.displayValue || "N/A",
        numeric: audits["cumulative-layout-shift"]?.numericValue || null,
      },
      speedIndex: {
        display: audits["speed-index"]?.displayValue || "N/A",
        numeric: audits["speed-index"]?.numericValue || null,
      },
    };
  }

  function extractOpportunities(data) {
    const audits = data.lighthouseResult?.audits || {};
    const keys = [
      "uses-rel-preload",
      "uses-rel-preconnect",
      "render-blocking-resources",
      "unused-javascript",
      "unminified-css",
      "unminified-javascript",
      "redirects",
    ];

    return keys
      .filter((key) => audits[key]?.details?.overallSavingsMs)
      .map((key) => ({
        title: audits[key].title,
        estimatedSavings: (audits[key].details.overallSavingsMs / 1000).toFixed(
          1
        ),
      }));
  }

  function extractThumbnail(data) {
    const screenshotThumbnails =
      data.lighthouseResult?.audits["screenshot-thumbnails"]?.details?.items;

    return screenshotThumbnails?.[0]?.data || null; // Just return the first (initial) thumbnail
  }

  const [mobileData, desktopData] = await Promise.all([
    fetchLighthouseData("mobile"),
    fetchLighthouseData("desktop"),
  ]);

  return {
    mobile: {
      scores: extractScores(mobileData),
      metrics: extractMetrics(mobileData),
      opportunities: extractOpportunities(mobileData),
      screenshot: extractThumbnail(mobileData),
    },
    desktop: {
      scores: extractScores(desktopData),
      metrics: extractMetrics(desktopData),
      opportunities: extractOpportunities(desktopData),
      screenshot: extractThumbnail(desktopData),
    },
  };
}

module.exports = { getLighthouseSummary };
