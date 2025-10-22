import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";
import { Plus } from "lucide-react";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const checkRes = await axios.get(`${API_URL}/check`, { withCredentials: true });
        if (!checkRes.data.logged_in) {
          navigate("/login");
          return;
        }
        setUsername(checkRes.data.username);

        const logsRes = await axios.get(`${API_URL}/logs`, { withCredentials: true });
        setLogs(logsRes.data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleNewNote = () => navigate("/new");
  const handleOpenNote = (id) => navigate(`/note/${id}`);

  return (
    <div className="dashboard-container">
      <TopBar username={username} />
      <main className="notes-grid">
        <div className="note-card new-note" onClick={handleNewNote}>
          <Plus className="plus-icon" />
          <span className="new-text">New Note</span>
        </div>

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
