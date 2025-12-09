import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!baseUrl) {
      setMessage("Error: API base URL not configured. Please check your .env file.");
      return;
    }

    if (!email || !password) {
      setMessage("Please enter both email and password");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.error || data.message || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful! Redirecting...");
        navigate("/events");
      } else {
        setMessage("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(`Network error: ${error.message}. Make sure the backend server is running.`);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <input
          className="login-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button">Login</button>
      </form>

      {message && <p className="error-text">{message}</p>}
    </div>
  );
}
