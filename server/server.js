require("dotenv").config();
const http = require("http");
const WebSocket = require("ws");
const { handleWebSocketMessage } = require("../services/crawlServices");

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server is Running\n");
});

const wss = new WebSocket.Server({ server });

const clientsByUserId = new Map(); // userId => Set of WebSocket clients

wss.on("connection", (ws) => {
  console.log(`Client connected. Total clients: ${wss.clients.size}`);

  ws.on("message", (message) =>
    handleWebSocketMessage(message, ws, clientsByUserId)
  );

  ws.on("close", () => {
    for (const [userId, sockets] of clientsByUserId.entries()) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        clientsByUserId.delete(userId);
      }
    }
    console.log(`Client disconnected. Remaining clients: ${wss.clients.size}`);
  });

  ws.on("error", (err) => {
    console.error("WebSocket Error:", err);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
