import { useState, useEffect } from "react";
import { w3cwebsocket as Socket } from "websocket";
import { Message } from "./Message";

const socket = new Socket("ws://127.0.0.1:8000");

const Chat = ({ userName }) => {
  const [myMessage, setMyMessage] = useState("");
  const [messages, setMessages] = useState([]);

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
    socket.send(
      JSON.stringify({
        ...reactedMessage,
        type: "reaction",
      }),
    );
    setMyMessage("");
  };

  useEffect(() => {
    socket.onopen = function () {
      console.log("WebSocket Client Connected");

      let userId = localStorage.getItem("userId");
      socket.send(JSON.stringify({ type: "uuid", userId }));
    };
  });

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    socket.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "uuid") {
          userId = data.userId;
          localStorage.setItem("userId", userId);
        } else if (data.type === "message") {
          setMessages((prevMessages) => {
            const messageIndex = prevMessages.findIndex(
              (msg) => msg.id === data.message.id,
            );
            if (messageIndex !== -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[messageIndex] = data.message;
              return updatedMessages;
            } else {
              return [...prevMessages, data.message];
            }
          });
        } else if (data.type === "reaction") {
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
            return [...messages];
          });
        }
      } catch (e) {
        console.error("Error parsing message data:", e);
      }
    };
  }, []);

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
