import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";
import "./EditNote.css";
const API_URL = import.meta.env.VITE_API_URL;


const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [note, setNote] = useState({ filename: "", content: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserAndNote = async () => {
      try {
        const checkRes = await axios.get(`${API_URL}/check`, {
          withCredentials: true,
        });

        if (!checkRes.data.logged_in) {
          navigate("/login");
          return;
        }
        setUsername(checkRes.data.username);

        const noteRes = await axios.get(`${API_URL}/logs/${id}`, {
          withCredentials: true,
        });
        setNote(noteRes.data);
      } catch (err) {
        console.error(err.response?.data || err);
        if (err.response?.status === 404)
          setMessage("Note not found or does not belong to you.");
        else if (err.response?.status === 401)
          setMessage("You are not logged in.");
        else setMessage("Something went wrong.");
      }
    };

    fetchUserAndNote();
  }, [id, navigate]);

  const handleChange = (e) => setNote({ ...note, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/logs/${id}`,
        { filename: note.filename, content: note.content },
        { withCredentials: true }
      );
      setMessage("Note updated successfully!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update note.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });
      setMessage("Note deleted successfully!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete note.");
    }
  };

  return (
    <div className="editnote-page">
      <TopBar username={username} />

      <div className="editnote-container">
        <h2>Edit Note</h2>

        <form className="editnote-form" onSubmit={handleSubmit}>
          <label>
            Filename:
            <input
              type="text"
              name="filename"
              value={note.filename}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Content:
            <textarea
              name="content"
              value={note.content}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="editnote-btn">
            Save
          </button>
        </form>

        <button className="delete-btn" onClick={handleDelete}>
          Delete Note
        </button>

        {message && <p className="editnote-msg">{message}</p>}
      </div>
    </div>
  );
};

export default EditNote;
