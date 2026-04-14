import axios from "axios";

// Environment variables for Vite
const API_URL = import.meta.env.VITE_API_URL || "https://skillscope-backend-5sw2.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Health check endpoint
export const getHealthStatus = async () => {
  const response = await api.get("/health");
  return response.data;
};

// Chat endpoint: { message }
export const sendChatMessage = async (message: string) => {
  const response = await api.post("/chat", { message });
  return response.data;
};

export default api;
