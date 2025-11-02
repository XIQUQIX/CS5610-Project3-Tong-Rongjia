import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (!data.error) {
      navigate("/login");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup} className="signup-form">
        <input
          className="signup-input"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="signup-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="signup-button">Create Account</button>
      </form>

      {message && <p className="signup-error">{message}</p>}
    </div>
  );
}
