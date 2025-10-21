import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar"; // new component
import { Plus } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndLogs = async () => {
      try {
        const checkRes = await axios.get("http://localhost:5000/check", {
          withCredentials: true,
        });

        if (!checkRes.data.logged_in) {
          navigate("/login");
          return;
        }

        setUsername(checkRes.data.username);

        const logsRes = await axios.get("http://localhost:5000/logs", {
          withCredentials: true,
        });

        setLogs(logsRes.data.reverse());
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUserAndLogs();
  }, [navigate]);

  const handleNewNote = () => navigate("/new");
  const handleOpenNote = (id) => navigate(`/note/${id}`);

  return (
    <div className="dashboard-container">
      {/* ✅ Top bar with logo + username */}
      <TopBar username={username} />

      <main className="notes-grid">
        {/* New Note Card */}
        <div className="note-card new-note" onClick={handleNewNote}>
          <Plus className="plus-icon" />
          <span className="new-text">New Note</span>
        </div>

        {/* Existing Notes */}
        {logs.map((log) => (
          <div key={log.id} className="note-card" onClick={() => handleOpenNote(log.id)}>
            <div className="note-content">{log.content.slice(0, 150)}</div>
            <div className="note-filename">{log.filename}</div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
