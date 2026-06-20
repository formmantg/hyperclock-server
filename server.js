import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: process.env.PORT || 8080
});

console.log("WS running");

function broadcast(data) {
  const msg = JSON.stringify(data);

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("user joined");

  broadcast({ type: "user_joined" });

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === "pulse") {
        broadcast({ type: "pulse" });
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on("close", () => {
    console.log("user left");
    broadcast({ type: "user_left" });
  });
});