import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import axios from "axios";
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
    setMessage("");

    try {
      // 1️⃣ Send login request
      await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      // 2️⃣ Immediately check login status (cookie is now registered)
      const checkRes = await axios.get(`${API_URL}/check`, {
        withCredentials: true,
      });

      if (checkRes.data.logged_in) {
        setMessage("Logged in successfully!");
        navigate("/dashboard");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      if (err.response) setMessage(err.response.data.error || "Invalid credentials");
      else setMessage("Server error, please try again later.");
    }
  };

  return (
    <div className="login-container">
      <LogoHeader />
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <p className="warning-text">*Please enter correct credentials</p>
          <button type="submit" className="login-btn">Login</button>
        </form>
        {message && <p className="response-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
