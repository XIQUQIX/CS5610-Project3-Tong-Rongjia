import { useState } from "react";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (!data.error) {
      localStorage.setItem("token", "dummy-token"); // replace with real JWT
      navigate("/");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button style={styles.primaryButton}>Login</button>
      </form>

      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "60px" },
  form: { display: "flex", flexDirection: "column", width: "240px", margin: "0 auto", gap: "10px" },
  primaryButton: {
    backgroundColor: "#28a745",
    border: "none",
    padding: "10px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
