import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Register the user
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Registration failed");
        return;
      }

      // 2️⃣ Automatically log in after registration
      const loginRes = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        localStorage.setItem("username", formData.username); // store username
        setMessage("Registered and logged in successfully!");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        setMessage(loginData.error || "Login failed after registration");
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
