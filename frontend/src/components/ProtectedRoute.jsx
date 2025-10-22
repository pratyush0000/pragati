import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // ✅ Always include credentials for Flask session cookie
        const res = await axios.get(`${API_URL}/check`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        setAllowed(res.data.logged_in);
      } catch (err) {
        console.error("Login check failed:", err);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    // Optional: better UX while waiting
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Checking login status...</div>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
