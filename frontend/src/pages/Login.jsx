import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import "./Login.css";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // important for Flask session
      });


      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("username", formData.username); // save username for display
        setMessage("logged in successfully!");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        setMessage(data.error || "invalid username or password");
      }
    } catch (err) {
      setMessage("server error, please try again later.");
    }
  };

  return (
    <div className="login-container">
      <LogoHeader />
      <div className="login-box">
        <h2 className="login-title">welcome back</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">
            username:
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="password">
            password:
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <p className="warning-text">*please enter correct credentials</p>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {message && <p className="response-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
