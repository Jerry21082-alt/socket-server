const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

// Create an HTTP server (needed for Render)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server is running\n");
});

// Create a WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected!");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Send response back to client
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start the server and bind to 0.0.0.0
server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server running on ws://0.0.0.0:${PORT}`);
});
