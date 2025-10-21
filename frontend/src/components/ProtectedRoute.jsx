import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("/check", {
          withCredentials: true, // ✅ include Flask session cookie
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
