import { useState, useEffect } from "react";
// import WebSocket from "ws";
import { w3cwebsocket as Socket } from "websocket";
import { Message } from "./Message";

const socket = new Socket("ws://127.0.0.1:8000");
// const socket = new WebSocket("ws://localhost:8000");

const Chat = ({ userName }) => {
  const [myMessage, setMyMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [messageReactions, setMessageReactions] = useState([]);

  // const onSend = () => {
  //   socket.send(
  //     JSON.stringify({
  //       type: "message",
  //       message: myMessage,
  //       userName,
  //     }),
  //   );
  //   setMyMessage("");
  // };
  const onSend = () => {
    socket.send(
      JSON.stringify({
        type: "message",
        content: myMessage,
        userName,
      }),
    );
    setMyMessage("");
  };

  const onReaction = (reactedMessage) => {
    console.log("Chat::onReaction()reactedMessage", reactedMessage);
    socket.send(
      JSON.stringify({
        ...reactedMessage,
        type: "reaction",
      }),
    );
    setMyMessage("");
  };

  // const onReaction = (reactions) => {
  //   client.send(
  //     JSON.stringify({
  //       type: "reaction",
  //       reactions,
  //     }),
  //   );
  // };
  useEffect(() => {
    socket.onopen = function () {
      console.log("WebSocket Client Connected");

      let userId = localStorage.getItem("userId"); // Retrieve the stored UUID, if it exists
      socket.send(JSON.stringify({ type: "uuid", userId })); // Send the UUID to the server
    };
  });

  useEffect(() => {
    // const socket = new WebSocket("ws://localhost:8000");
    let userId = localStorage.getItem("userId"); // Retrieve the stored UUID, if it exists
    //
    // socket.onopen = function () {
    //   socket.send(JSON.stringify({ type: "uuid", userId })); // Send the UUID to the server
    // };
    //
    socket.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "uuid") {
          console.log("socket::uuid -data-", data);
          userId = data.userId; // Store the UUID received from the server
          localStorage.setItem("userId", userId); // Save the UUID for future sessions
          console.log("Received UUID: ", userId);
        } else if (data.type === "message") {
          console.log("socket::message -data-", data);
          setMessages((prevMessages) => {
            const messageIndex = prevMessages.findIndex(
              (msg) => msg.id === data.message.id,
            );
            if (messageIndex !== -1) {
              // Message exists, update it
              const updatedMessages = [...prevMessages];
              updatedMessages[messageIndex] = data.message;
              return updatedMessages;
            } else {
              // New message, add it
              return [...prevMessages, data.message];
            }
          });
          // setMessages((messages) => {
          //   console.log("socket::setMessages()messages", messages);
          //   return [...messages, data.message];
          // });
          // setMessages((messages) => [
          //   ...messages,
          //   {
          //     id: data.id,
          //     message: data.message,
          //     userName: data.userName,
          //     reactions: data.reactions,
          //   },
          // ]);
        } else if (data.type === "reaction") {
          console.log("socket::reaction -data-", data);
          setMessages((messages) => {
            const processedData = {
              id: data.id,
              message: data.message,
              userName: data.userName,
              reactions: data.reactions,
            };
            const foundIndex = messages.findIndex((msg) => {
              return msg.id === processedData.id;
            });
            messages[foundIndex] = processedData;

            console.log("socket::reaction -data-", messages);
            return [...messages];
          });
        }
      } catch (e) {
        console.error("Error parsing message data:", e);
      }
    };
    // client.onopen = () => {
    //   console.log("WebSocket Client Connected");
    // };
    // client.onmessage = (message) => {
    //   console.log("effect mess", message);
    //   const data = JSON.parse(message.data);
    //   if (data.type === "message") {
    //     console.log("effect mess 22", data);
    //     setMessages((messages) => [
    //       ...messages,
    //       {
    //         id: data.id,
    //         message: data.message,
    //         userName: data.userName,
    //         reactions: data.reactions,
    //       },
    //     ]);
    //   }
    //
    //   if (data.type === "reaction") {
    //     console.log("R data", data);
    //     setMessages((messages) => {
    //       const processedData = {
    //         id: data.id,
    //         message: data.message,
    //         userName: data.userName,
    //         reactions: data.reactions,
    //       };
    //       const foundIndex = messages.findIndex((msg) => {
    //         return msg.id === processedData.id;
    //       });
    //       messages[foundIndex] = processedData;
    //       return [...messages];
    //     });
    //     // setMessageReactions((reactions) => [
    //     //   ...reactions,
    //     //   {
    //     //     reactions: data.reactions,
    //     //   },
    //     // ]);
    //   }
    // };
  }, []);

  // console.log("CHAT reactions", messageReactions);
  console.log("CHAT messages", messages);
  return (
    <>
      <div className="title">Socket Chat: {userName}</div>
      <div className="chat-container">
        <aside className="conversations">
          <button className="button conversation--current">
            Current conversation
          </button>
          <button className="button">Conversation 2</button>
          <button className="button">Conversation 3</button>
          <button className="button">Conversation 4</button>
          <button className="button">Conversation 5</button>
        </aside>
        <header className="conversation-header">
          <h2>
            Let's pretend that we have different conversations on the left
          </h2>
        </header>
        <section className="chat">
          <div className="messages">
            {messages.length &&
              messages.map((message, key) => (
                <Message
                  key={key}
                  message={message}
                  userName={userName}
                  onReaction={onReaction}
                />
              ))}
          </div>
          <section className="send">
            <input
              type=""
              className="input send__input"
              value={myMessage}
              onChange={(e) => setMyMessage(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && onSend()}
              placeholder="Message"
            ></input>
            <button className="button send__button" onClick={onSend}>
              Send
            </button>
          </section>
        </section>
      </div>
    </>
  );
};

export default Chat;
