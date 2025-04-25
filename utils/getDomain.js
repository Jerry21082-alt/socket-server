function getDomain(url) {
  try {
    const { origin } = new URL(url); // Keep protocol (https://)
    return origin.replace(/^www\./, ""); // Remove 'www.'
  } catch (error) {
    console.error("Invalid URL:", url);
    return null;
  }
}

module.exports = { getDomain };
