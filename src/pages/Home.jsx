import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome!</h1>
      <p style={styles.subtitle}>Please choose an option to continue:</p>

      <div style={styles.buttonGroup}>
        <button style={styles.primaryButton} onClick={() => navigate("/signup")}>
          Sign Up
        </button>

        <button style={styles.secondaryButton} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  primaryButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 26px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  secondaryButton: {
    backgroundColor: "#444",
    color: "white",
    border: "none",
    padding: "12px 26px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
