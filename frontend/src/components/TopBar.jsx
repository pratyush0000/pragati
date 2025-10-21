import React, { useState } from "react";
import LogoHeader from "./LogoHeader";
import "../global.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const TopBar = ({ username }) => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed, try again.");
    }
  };

  return (
    <header className="topbar-container">
      <div className="topbar-left">
        <LogoHeader username={username} />
      </div>

      <div className="topbar-right">
        {username && (
          <span
            className="topbar-username"
            onClick={() => setShowLogout(true)}
            style={{ cursor: "pointer" }}
          >
            {username}
          </span>
        )}
      </div>

      {/* Logout confirmation popup */}
      {showLogout && (
        <div className="logout-popup">
          <p>Do you want to log out?</p>
          <div className="logout-buttons">
            <button onClick={handleLogout}>Yes</button>
            <button onClick={() => setShowLogout(false)}>No</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
