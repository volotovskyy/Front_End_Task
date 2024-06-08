// const webSocketServer = require("websocket").server;
// const http = require("http");
// const webSocketsServerPort = 8000;
//
// const server = http.createServer();
// server.listen(webSocketsServerPort);
// console.log("listening on port 8000....");
//
// const wsServer = new webSocketServer({
//   httpServer: server,
// });
//
// const generateID = () => "id" + Math.random().toString(16).slice(2);
// const connectedUsers = {};
//
// wsServer.on("request", function (request) {
//   var id = generateID();
//   console.log("Connection request from " + request.origin + ".");
//
//   const connection = request.accept(null, request.origin);
//   connectedUsers[id] = connection;
//   console.log(
//     "Connection established: " +
//       id +
//       " in " +
//       Object.getOwnPropertyNames(connectedUsers),
//   );
//
//   connection.on("message", function (message) {
//     console.log("Received Message: ", message.utf8Data);
//     for (id in connectedUsers) {
//       connectedUsers[id].sendUTF(message.utf8Data);
//       console.log("Sent Message to: ", connectedUsers[id]);
//     }
//   });
//
//   connection.on("reaction", function (reactions) {
//     console.log("Received reactions: ", reactions.utf8Data);
//     for (id in connectedUsers) {
//       connectedUsers[id].sendUTF(reactions.utf8Data);
//       console.log("Sent Message to: ", connectedUsers[id]);
//     }
//   });
// });
//
// const uuid = require("uuid");
// const webSocketServer = require("websocket").server;
// const PocketBase = require("pocketbase");
//
// const http = require("http");
// import { v4 as uuidv4 } from "uuid";
// import { WebSocketServer } from "ws";
// import PocketBase from "pocketbase";
// import http from "http";
// const webSocketsServerPort = 8000;
//
// const server = http.createServer();
// server.listen(webSocketsServerPort);
// console.log("listening on port 8000....");
//
// const wsServer = new WebSocketServer({
//   server: server,
// });
//
// const pb = new PocketBase("http://127.0.0.1:8090");
//
// const generateID = () => "id" + Math.random().toString(16).slice(2);
// const connectedUsers = {};
//
// wsServer.on("request", function (request) {
//   const id = generateID();
//   console.log("Connection request from " + request.origin + ".");
//   // const msgID = 1;
//   const connection = request.accept(null, request.origin);
//   connectedUsers[id] = connection;
//   console.log(
//     "Connection established: " + id + " in " + Object.keys(connectedUsers),
//   );
//
//   connection.on("message", async function (message) {
//     console.log("Received Message: ", message.utf8Data);
//
//     try {
//       const data = JSON.parse(message.utf8Data);
//       console.log("serverData", data);
//       if (data.type === "reaction") {
//         console.log("Received reactions: ", data.reactions);
//         for (let userId in connectedUsers) {
//           connectedUsers[userId].sendUTF(
//             JSON.stringify({
//               type: "reaction",
//               id: data.id,
//               message: data.message,
//               userName: data.userName,
//               reactions: data.reactions,
//             }),
//           );
//           console.log("Sent reactions to: ", userId);
//         }
//       } else {
//         // Store the message in PocketBase
//         const messageId = uuidv4();
//         const newMessage = {
//           id: messageId,
//           content: data.content,
//           userId: connection.userId,
//           timestamp: new Date().toISOString(),
//         };
//
//         await pb.collection("messages").create(newMessage);
//         console.log("Message stored:", newMessage);
//
//         for (let userId in connectedUsers) {
//           connectedUsers[userId].sendUTF(
//             JSON.stringify({
//               type: "message",
//               message: newMessage,
//               // message: data.message,
//               // userName: data.userName,
//               // id: uuid.v4(),
//             }),
//           );
//           console.log("Sent Message to: ", userId);
//         }
//       }
//     } catch (e) {
//       console.error("Invalid JSON received:", message.utf8Data);
//     }
//   });
//
//   connection.on("close", function () {
//     delete connectedUsers[id];
//     console.log("Connection closed: " + id);
//   });
// });
//
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
        // Store the message in PocketBase
        // const messageId = uuidv4();
        const newMessage = {
          // id: messageId,
          content: data.content,
          userName: data.userName,
          userId: userId,
          reactions: [],
          // timestamp: new Date().toISOString(),
        };
        console.log("server::newMessayge", newMessage);
        try {
          const storedMessage = await pb
            .collection("messages")
            .create(newMessage);
          console.log("Message stored in PocketBase:", storedMessage);
        } catch (e) {
          console.error("Error storing message in PocketBase:", e);
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
          console.log("server::boardcast--send to--: ", id);
        }
      }

      if (data.type === "reaction") {
        // Handle reaction
        const messageId = data.id;
        const reactions = data.reactions;
        console.log("server::newReactions", { messageId, reactions });

        try {
          const message = await pb.collection("messages").getOne(messageId);
          if (message) {
            // Update reactions field
            const updatedReactions = message.reactions || [];
            [...updatedReactions, ...reactions];

            const updatedMessage = {
              ...message,
              reactions: updatedReactions,
            };

            const result = await pb
              .collection("messages")
              .update(messageId, updatedMessage);
            console.log("Message reactions updated in PocketBase:", result);

            // Broadcast the updated message to all connected users
            for (const [id, userConnection] of connectedUsers) {
              userConnection.send(
                JSON.stringify({
                  type: "message",
                  message: updatedMessage,
                }),
              );
              console.log("Sent updated message to: ", id);
            }
          }
        } catch (e) {
          console.error("Error updating message reactions in PocketBase:", e);
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
