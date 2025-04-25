const { JSDOM } = require("jsdom");

function analyzeSEO(html, url) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const issues = new Map(); // Using a Map to prevent duplicate issues

  function addIssue(type, message) {
    const issueKey = `${type}-${message}-${url}`;
    if (!issues.has(issueKey)) {
      issues.set(issueKey, { type, message, url });
    }
  }

  // Title Tag Checks
  const title = document.querySelector("title");
  if (!title) {
    addIssue("title", "Missing title tag");
  } else {
    const titleText = title.textContent.trim();
    if (titleText.length < 30 || titleText.length > 60) {
      addIssue(
        "title",
        `Title length (${titleText.length} chars) is not optimal`
      );
    }
  }

  // Meta Description Checks
  const metaDescription = document.querySelector("meta[name='description']");
  if (!metaDescription) {
    addIssue("meta", "Missing meta description");
  } else {
    const descText = metaDescription.content.trim();
    if (descText.length < 50 || descText.length > 160) {
      addIssue(
        "meta",
        `Meta description length (${descText.length} chars) is not optimal`
      );
    }
  }

  // H1 Tag Checks
  const h1Tags = document.querySelectorAll("h1");
  if (h1Tags.length === 0) {
    addIssue("h1", "Missing H1 tag");
  } else if (h1Tags.length > 1) {
    addIssue("h1", "Multiple H1 tags found");
  }

  // Image ALT Checks (Ensuring Unique Issues)
  let missingAltImages = 0;
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("alt") || img.getAttribute("alt").trim() === "") {
      missingAltImages++;
    }
  });
  if (missingAltImages > 0) {
    addIssue(
      "image",
      `Found ${missingAltImages} images missing alt attributes`
    );
  }

  // Canonical Tag Check
  const canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    addIssue("canonical", "Missing canonical tag");
  }

  // Mobile Friendliness Check
  const viewport = document.querySelector("meta[name='viewport']");
  if (!viewport) {
    addIssue("mobile", "Missing viewport meta tag");
  }

  // Indexability Check
  const robotsMeta = document.querySelector("meta[name='robots']");
  if (robotsMeta && robotsMeta.content.includes("noindex")) {
    addIssue("indexability", "Page is set to noindex");
  }

  return Array.from(issues.values()); // Convert Map back to an array
}

module.exports = { analyzeSEO };
