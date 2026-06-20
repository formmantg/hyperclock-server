import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("WS server running on ws://localhost:8080");

function broadcast(data) {
  const msg = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("user joined");

  // event dla wszystkich
  broadcast({ type: "user_joined" });

  ws.on("close", () => {
    console.log("user left");

    broadcast({ type: "user_left" });
  });

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "pulse") {
        broadcast({ type: "pulse" });
      }
    } catch (e) {}
  });
});