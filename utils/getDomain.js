function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {
    console.error("Invalid URL:", url);
    return null;
  }
}

module.exports = { getDomain };
