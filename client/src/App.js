import React, { useState } from "react";
import "./App.css";
import ChatGates from "./components/ChatGates";
import Chat from "./components/Chat";

function App() {
  const [userName, setUserName] = useState("");

  return (
    <div className="container">
      {userName ? (
        <Chat userName={userName} />
      ) : (
        <ChatGates setUserName={setUserName} />
      )}
    </div>
  );
}

export default App;
