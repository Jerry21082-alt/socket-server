const { startCrawl } = require("../server/crawler");

async function handleWebSocketMessage(message, ws, clientsByUserId) {
  let data;

  try {
    data = JSON.parse(message);
  } catch (err) {
    console.error("Failed to parse message:", message);
    ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
    return;
  }

  const { type, url, userId } = data;

  if (type === "start-crawl") {
    if (!url || !userId) {
      ws.send(
        JSON.stringify({ type: "error", message: "Missing url or userId" })
      );
      return;
    }

    // Track this user's sockets
    if (!clientsByUserId.has(userId)) {
      clientsByUserId.set(userId, new Set());
    }
    clientsByUserId.get(userId).add(ws);

    console.log(`[WS] Starting crawl for ${url} [userId: ${userId}]`);

    try {
      await startCrawl({ startUrl: url, userId, ws });
    } catch (err) {
      console.error("Crawl failed:", err);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Crawl failed: " + err.message,
        })
      );
    }
  } else if (type === "lighthouse") {
    if (!url) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Missing URL for lighthouse audit",
        })
      );
      return;
    }

    try {
      const result = await runLighthouseAudit(url);
      ws.send(JSON.stringify({ type: "lighthouse-result", result }));
    } catch (err) {
      console.error("Lighthouse audit failed:", err);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Lighthouse error: " + err.message,
        })
      );
    }
  } else {
    ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
  }
}

module.exports = { handleWebSocketMessage };
