import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "https://backend-healthhub.vercel.app";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const requestOtp = (email) => API.post("/auth/send-otp", { email });
export const verifyOtp = (email, otp) => API.post("/auth/verify-otp", { email, otp });
export const resendOtp = (email) => API.post("/auth/resend-otp", { email });

export default API;