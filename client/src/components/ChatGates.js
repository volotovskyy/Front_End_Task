import { useState } from "react";

const ChatGates = ({ setUserName }) => {
  const [login, setLogin] = useState("");

  return (
    <div className="chat-gates">
      <div className="chat-gates__form">
        <input
          className="input"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && setUserName(login)}
          type="text"
          placeholder="Enter Username"
        ></input>
        <button
          className="button chat-gates__form__button"
          onClick={() => setUserName(login)}
        >
          Enter chatroom
        </button>
      </div>
    </div>
  );
};

export default ChatGates;
