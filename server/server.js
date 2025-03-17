require("dotenv").config();
const http = require("http");
const WebSocket = require("ws");
const { crawlWebsite } = require("../services/crawlServices");

const PORT = process.env.PORT || 3001;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server is Running\n");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log(`Client connected. Total clients: ${wss.clients.size}`);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Received:`, data);

      if (data.type === "startCrawl" && data.url) {
        console.log(`Starting crawl for: ${data.url}`);

        // Start crawling in the WebSocket server
        crawlWebsite(data.url, data.maxDepth, ws);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send(JSON.stringify({ error: "Invalid request format" }));
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected. Remaining clients: ${wss.clients.size}`);
  });

  ws.on("error", (err) => {
    console.error("WebSocket Error:", err);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
