import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // Send & receive HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
