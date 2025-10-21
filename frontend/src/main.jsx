import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './global.css'

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL is:", API_URL);

// ✅ Axios global config
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // include Flask session cookies

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
