import { WebSocketServer } from "ws";
import http from "http";
import PocketBase from "pocketbase";

const webSocketsServerPort = 8000;
const server = http.createServer();

server.listen(webSocketsServerPort, () => {
  console.log("Listening on port 8000....");
});

const wss = new WebSocketServer({ server });

const pb = new PocketBase("http://127.0.0.1:8090");

const connectedUsers = new Map();

wss.on("connection", function (ws, req) {
  ws.on("message", async function (message) {
    try {
      const data = JSON.parse(message);
      console.log("server::data", data);

      if (data.type === "auth") {
        const { token } = data;
        try {
          pb.authStore.save(token);
          const authData = await pb.collection("users").authRefresh();
          console.log("server::authData", authData);

          const userId = pb.authStore.model.id;
          connectedUsers.set(userId, ws);
          ws.send(JSON.stringify({ type: "auth-success", userId }));
          console.log("Authenticated user:", userId);
        } catch (e) {
          console.error("Token authentication failed:", e);
          ws.send(
            JSON.stringify({ type: "auth-failure", message: "Invalid token" }),
          );
        }
        return;
      }

      const userId = data.userId;
      if (!connectedUsers.has(userId)) {
        ws.send(
          JSON.stringify({ type: "error", message: "User not authenticated" }),
        );
        return;
      }

      if (data.type === "message") {
        const newMessage = {
          content: data.content,
          userName: data.userName,
          userId: userId,
          reactions: [],
        };

        let storedMessage;
        try {
          storedMessage = await pb.collection("messages").create(newMessage);
          console.log("Message stored in PocketBase:", storedMessage);
        } catch (e) {
          console.error("Error storing message in PocketBase:", e);
          return;
        }

        const processedMessage = {
          ...newMessage,
          id: storedMessage.id,
        };

        for (const [id, userConnection] of connectedUsers) {
          const messageToBeBroadcasted = JSON.stringify({
            type: "message",
            message: processedMessage,
          });
          userConnection.send(messageToBeBroadcasted);
        }
      }

      if (data.type === "reaction") {
        const messageId = data.id;
        const reactions = data.reactions;

        let message;
        try {
          message = await pb.collection("messages").getOne(messageId);
        } catch (e) {
          console.error("Error retrieving message from PocketBase:", e);
          return;
        }

        if (message) {
          const updatedMessage = {
            ...message,
            reactions: [...reactions],
          };

          let result;
          try {
            result = await pb
              .collection("messages")
              .update(messageId, updatedMessage);
            console.log("Message reactions updated in PocketBase:", result);
          } catch (e) {
            console.error("Error updating message reactions in PocketBase:", e);
            return;
          }

          const processedUpdatedMessage = {
            ...updatedMessage,
          };

          for (const [id, userConnection] of connectedUsers) {
            const messageToBeBroadcasted = JSON.stringify({
              type: "message",
              message: processedUpdatedMessage,
            });
            userConnection.send(messageToBeBroadcasted);
          }
        }
      }
    } catch (e) {
      console.error("Invalid JSON received:", message);
    }
  });

  ws.on("close", function () {
    connectedUsers.forEach((connection, userId) => {
      if (connection === ws) {
        connectedUsers.delete(userId);
        console.log("Connection closed for user:", userId);
      }
    });
  });
});
