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
        const res = await axios.get(`${API_URL}/check`, {
          withCredentials: true, // include Flask session cookie
        });
        setAllowed(res.data.logged_in);
      } catch (err) {
        console.error(err);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!allowed) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
