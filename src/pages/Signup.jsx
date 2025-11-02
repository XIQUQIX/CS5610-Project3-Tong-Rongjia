import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // Example: calling backend /register if your server is running
    const res = await fetch("/register", {
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
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button style={styles.primaryButton}>Create Account</button>
      </form>

      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "60px" },
  form: { display: "flex", flexDirection: "column", width: "240px", margin: "0 auto", gap: "10px" },
  primaryButton: {
    backgroundColor: "#007bff",
    border: "none",
    padding: "10px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
