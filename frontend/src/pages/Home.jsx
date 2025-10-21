import "./Home.css";
import { Link } from "react-router-dom";
import logo from "../assets/pragatilogo.png";

export default function Home() {
  return (
    <div className="home-container">
      {/* Left side */}
      <div className="home-left">
        <img src={logo} alt="Pragati Logo" className="logo" />
        <h1 className="tagline">your progress tracker</h1>
      </div>

      {/* Right side */}
      <div className="home-right">
        <Link to="/register" className="btn btn-register">
          register
        </Link>
        <p className="or-text">or</p>
        <Link to="/login" className="btn btn-login">
          login
        </Link>
      </div>
    </div>
  );
}
