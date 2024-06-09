import React, { useState, useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import ChatGates from "./components/ChatGates";
import { loginUser, registerUser } from "./services/authService";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("pocketbase_auth");
    if (storedUser && token) {
      setUser({ ...storedUser, token });
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const authData = await loginUser(email, password);
      localStorage.setItem("user", JSON.stringify(authData));
      localStorage.setItem("pocketbase_auth", authData.token);
      setUser(authData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (email, password, username) => {
    try {
      await registerUser(email, password, username);
      // Automatically log in after registration
      await handleLogin(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("pocketbase_auth");
    setUser(null);
  };

  return user ? (
    <Chat user={user} onLogout={handleLogout} />
  ) : (
    <ChatGates onLogin={handleLogin} onRegister={handleRegister} />
  );
};

export default App;
