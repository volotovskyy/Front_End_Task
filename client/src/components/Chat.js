import React, { useState, useEffect, useRef } from "react";
import { w3cwebsocket as Socket } from "websocket";
import PocketBase from "pocketbase";
import { Message } from "./Message";

const Chat = ({ user, onLogout }) => {
  const pb = new PocketBase("http://127.0.0.1:8090");
  const { username: userName, id: userId, email } = user.record;
  const [myMessage, setMyMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const authenticateWithToken = async (token) => {
      try {
        pb.authStore.save(token, user.userId);
        const authData = await pb.collection("users").authRefresh();
        socketRef.current.send(
          JSON.stringify({
            type: "auth",
            token: pb.authStore.token,
          }),
        );
        console.log("Authenticated with token:", authData);
      } catch (e) {
        console.error("Token authentication failed:", e);
        onLogout(); // Log out the user if the token is invalid
      }
    };

    socketRef.current = new Socket("ws://127.0.0.1:8000");

    socketRef.current.onopen = () => {
      console.log("WebSocket Client Connected");
      const token = localStorage.getItem("pocketbase_auth");
      if (token) {
        authenticateWithToken(token);
      } else {
        onLogout();
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("client::data", data);

        if (data.type === "auth-success") {
          console.log("Authentication successful. User ID:", data.userId);
        } else if (data.type === "auth-failure") {
          console.error("Authentication failed:", data.message);
        } else if (data.type === "message") {
          setMessages((prevMessages) => {
            const messageIndex = prevMessages.findIndex(
              (msg) => msg.id === data.message.id,
            );
            if (messageIndex !== -1) {
              // Update existing message
              const updatedMessages = [...prevMessages];
              updatedMessages[messageIndex] = data.message;
              return updatedMessages;
            } else {
              // Add new message
              return [...prevMessages, data.message];
            }
          });
        }
      } catch (e) {
        console.error("Error parsing message data:", e);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    // Handle WebSocket disconnect
    socketRef.current.onclose = () => {
      console.log("WebSocket Client Disconnected");
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (
          !socketRef.current ||
          socketRef.current.readyState === Socket.CLOSED
        ) {
          socketRef.current = new Socket("ws://127.0.0.1:8000");
        }
      }, 3000);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = () => {}; // Disable onclose handler first
        socketRef.current.close();
      }
    };
  }, [user]);

  const onSend = () => {
    socketRef.current.send(
      JSON.stringify({
        type: "message",
        content: myMessage,
        userName,
        userId,
      }),
    );
    setMyMessage("");
  };

  const onReaction = (reactedMessage) => {
    console.log("onReaction+reactedMessage", reactedMessage);
    socketRef.current.send(
      JSON.stringify({
        ...reactedMessage,
        type: "reaction",
      }),
    );
    setMyMessage("");
  };

  return (
    <>
      <div className="title">
        Socket Chat: {userName} <button onClick={onLogout}>Logout</button>
      </div>
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
