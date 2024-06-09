import React, { useState } from "react";

const ChatGates = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    onLogin(email, password);
  };

  const handleRegister = () => {
    onRegister(email, password, username);
  };

  return (
    <div className="container">
      <div className="form">
        <img src="/timezynk_logo_with_text.svg" className="form__logo" />
        <h2>{isLogin ? "Login" : "Register"} </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form__input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form__input"
        />
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form__input"
          />
        )}
        {isLogin ? (
          <button onClick={handleLogin} className="form__button">
            Login
          </button>
        ) : (
          <button onClick={handleRegister} className="form__button">
            Register
          </button>
        )}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="form__button form__button--toggle"
        >
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
};

export default ChatGates;
