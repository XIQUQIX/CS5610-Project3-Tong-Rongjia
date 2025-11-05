import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="home-title">Welcome!</h1>
      <p className="home-subtitle">Please choose an option to continue:</p>

      <div className="button-group">
        <button className="primary-btn" onClick={() => navigate("/signup")}>
          Sign Up
        </button>

        <button className="secondary-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
      </>
  );
}
