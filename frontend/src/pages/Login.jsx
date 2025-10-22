import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Use env variable for API URL
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/login`,
        formData,
        { withCredentials: true } // ✅ include Flask session cookie
      );

      if (res.status === 200) {
        setMessage("Logged in successfully!");
        navigate("/dashboard"); // redirect immediately
      }
    } catch (err) {
      if (err.response) {
        // Backend returned an error
        setMessage(err.response.data.error || "Invalid credentials");
      } else {
        // Network error
        setMessage("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <LogoHeader />
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">
            Username:
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
            Password:
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <p className="warning-text">*Please enter correct credentials</p>

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
