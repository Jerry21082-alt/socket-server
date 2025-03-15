require("dotenv").config();
const WebSocket = require("ws");

const PORT = process.env.PORT || 3001;
const server = new WebSocket.Server({ port: PORT });

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);

server.on("connection", (socket) => {
  console.log("⚡ New WebSocket connection");

  socket.on("message", (message) => {
    console.log(`📩 Received: ${message}`);
    socket.send(`Echo: ${message}`); // Send back the message
  });

  socket.on("close", () => {
    console.log("❌ WebSocket connection closed");
  });
});
