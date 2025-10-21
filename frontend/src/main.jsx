import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'          // ✅ add this
import App from './App.jsx'
import './global.css'

// ✅ Axios global config
axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.withCredentials = true // include Flask session cookies

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
