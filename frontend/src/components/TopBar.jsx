import React from "react";
import LogoHeader from "./LogoHeader";
import "../global.css"; // or your Dashboard.css

const TopBar = ({ username }) => {
  return (
    <header className="topbar-container">
      <div className="topbar-left">
        <LogoHeader /> 
      </div>
      <div className="topbar-right">
        <span className="topbar-username">{username}</span>
      </div>
    </header>
  );
};

export default TopBar;
