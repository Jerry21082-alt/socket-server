function ensureValidUrl(url) {
  try {
    let formattedUrl = url.startsWith("http") ? url : `https://${url}`; // Ensure absolute URL
    const parsed = new URL(formattedUrl);
    return parsed.href;
  } catch (error) {
    console.warn("Skipping invalid URL:", url);
    return null;
  }
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = ""; // Remove fragments like #section

    // Optional: remove tracking or session parameters
    const paramsToIgnore = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "sessionid",
    ];
    for (let param of paramsToIgnore) {
      parsed.searchParams.delete(param);
    }

    let cleaned = parsed.toString();

    // Remove trailing slash
    if (cleaned.endsWith("/")) {
      cleaned = cleaned.slice(0, -1);
    }

    return cleaned.toLowerCase(); // For consistent comparison
  } catch {
    return null;
  }
}

module.exports = { ensureValidUrl, normalizeUrl };
