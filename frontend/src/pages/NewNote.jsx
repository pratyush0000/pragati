import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";
import "./NewNote.css";
const API_URL = import.meta.env.VITE_API_URL;

const NewNote = () => {
  const [username, setUsername] = useState("");
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/check`, {
          withCredentials: true,
        });

        if (!res.data.logged_in) {
          navigate("/login");
          return;
        }

        setUsername(res.data.username);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSave = async () => {
    if (!filename || !content) {
      setMessage("Please enter filename and content.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/add`,
        { filename, content },
        { withCredentials: true }
      );
      setMessage("Note saved successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Error saving note, try again.");
    }
  };

  return (
    <div className="newnote-page">
      {/* ✅ Top bar with username */}
      <TopBar username={username} />

      <div className="newnote-container">
        <h2 className="newnote-title">Create New Note</h2>

        <input
          type="text"
          placeholder="Filename"
          className="newnote-filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />

        <textarea
          placeholder="Write your note here..."
          className="newnote-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {message && <p className="newnote-msg">{message}</p>}

        <button className="newnote-save-btn" onClick={handleSave}>
          Save Note
        </button>
      </div>
    </div>
  );
};

export default NewNote;
