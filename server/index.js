import { WebSocketServer } from "ws";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import PocketBase from "pocketbase";

const webSocketsServerPort = 8000;
const server = http.createServer();
server.listen(webSocketsServerPort, () => {
  console.log("Listening on port 8000....");
});

const wss = new WebSocketServer({ server });

const pb = new PocketBase("http://127.0.0.1:8090"); // Adjust to your PocketBase URL

const connectedUsers = new Map(); // Use a Map to store connections by UUID

wss.on("connection", function (ws, req) {
  const userId = uuidv4(); // Generate a new UUID for the user

  connectedUsers.set(userId, ws);
  console.log("Connection established: " + userId);

  // Send the user their UUID
  ws.send(JSON.stringify({ type: "uuid", userId }));

  ws.on("message", async function (message) {
    try {
      const data = JSON.parse(message);
      console.log("server::data", data);

      if (data.type === "message") {
        const newMessage = {
          content: data.content,
          userName: data.userName,
          userId: userId,
          reactions: [],
        };

        console.log("server::newMessage", newMessage);

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
        console.log("server::processedMessage", processedMessage);

        // Broadcast the message to all connected users
        for (const [id, userConnection] of connectedUsers) {
          const messageToBeBroadcasted = JSON.stringify({
            type: "message",
            message: processedMessage,
          });
          console.log("server::broadcast--message--", messageToBeBroadcasted);
          userConnection.send(messageToBeBroadcasted);
          console.log("server::broadcast--send to--: ", id);
        }
      }

      if (data.type === "reaction") {
        const messageId = data.id;
        const reactions = data.reactions;
        console.log("server::newReaction", { messageId, reactions });

        let message;
        try {
          message = await pb.collection("messages").getOne(messageId);
        } catch (e) {
          console.error("Error retrieving message from PocketBase:", e);
          return;
        }

        if (message) {
          // const updatedReactions = message.reactions || [];

          const updatedMessage = {
            ...message,
            reactions: [...reactions],
            // reactions: [...updatedReactions, ...reactions],
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
            // id: messageId,
          };

          // Broadcast the updated message to all connected users
          for (const [id, userConnection] of connectedUsers) {
            const messageToBeBroadcasted = JSON.stringify({
              type: "message",
              message: processedUpdatedMessage,
            });
            console.log("server::broadcast--message--", messageToBeBroadcasted);
            userConnection.send(messageToBeBroadcasted);
            console.log("server::broadcast--send to--: ", id);
          }
        }
      }
    } catch (e) {
      console.error("Invalid JSON received:", message);
    }
  });

  ws.on("close", function () {
    connectedUsers.delete(userId);
    console.log("Connection closed: " + userId);
  });
});
