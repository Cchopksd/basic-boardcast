import express from "express";
import bodyParser from "body-parser";
import WebSocket, { WebSocketServer } from "ws";

const app = express();

app.use(bodyParser.json());

const wss = new WebSocketServer({ port: 3001 });

app.get("/", (_, res) => {
  res.send("Hello World!");
});

wss.on("connection", (socket) => {
  console.log("User connected");
  socket.send(
    JSON.stringify({ user: "admin", received: "Welcome to the chat" })
  );

  socket.on("message", (msg: WebSocket.RawData) => {
    try {
      const receivedMessage = JSON.parse(msg.toString());
      const user = receivedMessage.user;

      const message = receivedMessage.message;

      if (!user || !message) {
        return "Missing userId or message in the received data";
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ user, received: message }));
        }
      });
    } catch (error: any) {
      console.error("Error parsing message:", error.message);
      socket.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });

  socket.on("close", () => {
    console.log("User disconnected");
  });
});

app.listen(3002, () => {
  console.log("HTTP server listening on port 3002");
});
