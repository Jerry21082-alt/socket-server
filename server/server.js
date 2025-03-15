const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

// Create an HTTP server (needed for WebSocket on Render)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server is Running\n");
});

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  ws.on("message", (message) => {
    console.log(`📩 Received: ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// Start the server and listen on 0.0.0.0
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket Server running on port ${PORT}`);
});
