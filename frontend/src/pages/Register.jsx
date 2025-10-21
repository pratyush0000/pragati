import React, { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
        });


      const data = await res.json();
      if (res.ok) {
        setMessage("registered successfully!");
      } else {
        setMessage(`${data.error || "registration failed"}`);
      }
    } catch (err) {
      setMessage("server error, please try again later.");
    }
  };

  return (
    <div className="register-container">
      <LogoHeader />
      <div className="register-box">
        <h2 className="register-title">new user?</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <p className="warning-text">
            *there is no forget password, so please don’t forget your password :)
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
