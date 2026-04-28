// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:2026" : "https://backend-healthhub.vercel.app"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;