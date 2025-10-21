import React from "react";
import { useNavigate } from "react-router-dom";
import "../global.css";

const LogoHeader = ({ username }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (username) {
      navigate("/dashboard"); // logged in
    } else {
      navigate("/"); // not logged in
    }
  };

  return (
    <header className="logo-header" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img
        src="/pragatilogo.png"
        alt="Pragati Logo"
        className="logo-small"
      />
    </header>
  );
};

export default LogoHeader;
