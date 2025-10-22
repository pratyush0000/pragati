import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import axios from "axios";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
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
      // 1️⃣ Register the user
      const res = await axios.post(`${API_URL}/register`, formData, {
        withCredentials: true,
      });

      if (res.status !== 201) {
        setMessage(res.data?.error || "Registration failed");
        return;
      }

      // 2️⃣ Auto-login after registration
      const loginRes = await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true,
      });

      if (loginRes.status === 200) {
        setMessage("Registered and logged in successfully!");
        navigate("/dashboard");
      } else {
        setMessage(loginRes.data?.error || "Login failed after registration");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again later.");
    }
  };

  return (
    <div className="register-container">
      <LogoHeader />
      <div className="register-box">
        <h2 className="register-title">New User?</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <p className="warning-text">
            *There is no forget password, so please don’t forget your password :)
          </p>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {message && <p className="response-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
