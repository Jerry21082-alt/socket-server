require("dotenv").config();
const cheerio = require("cheerio");

const SCRAPFLY_API_KEY = process.env.SCRAPFLY_API_KEY;

if (!SCRAPFLY_API_KEY) {
  throw new Error("SCRAPFLY_API_KEY is missing in environment variables.");
}

async function fetchPageContent(url) {
  const scrapflyUrl = `https://api.scrapfly.io/scrape?key=${SCRAPFLY_API_KEY}&url=${encodeURIComponent(
    url
  )}&render_js=true&wait_for=2000`;

  try {
    const response = await fetch(scrapflyUrl);
    const data = await response.json();

    if (!data.result || !data.result.content) {
      throw new Error(`Failed to fetch content for ${url}`);
    }

    return data.result.content;
  } catch (error) {
    console.error("Scrapfly API Error:", error);
    return null;
  }
}

function extractLinks(html, domain) {
  const $ = cheerio.load(html);
  const links = new Set();

  $("a").each((_, el) => {
    let href = $(el).attr("href");

    if (href) {
      try {
        const absoluteUrl = new URL(href, domain).href;
        if (absoluteUrl.startsWith(domain)) {
          links.add(absoluteUrl);
        }
      } catch (error) {
        console.warn("Invalid URL:", href);
      }
    }
  });

  return Array.from(links);
}

module.exports = { fetchPageContent, extractLinks };
