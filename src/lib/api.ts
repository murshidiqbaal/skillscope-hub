import axios from "axios";

// Environment variables for Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://skillscope-api.render.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin stats: { total_users, weekly_growth, active_sessions, etc. }
export const fetchAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

// Skill demand: Array<{ skill: string, demand: number }>
export const fetchSkillDemandChart = async () => {
  const response = await api.get("/admin/chart/skills");
  return response.data;
};

// Resume usage: Array<{ week: string, analyses: number }>
export const fetchResumeUsageChart = async () => {
  const response = await api.get("/admin/chart/usage");
  return response.data;
};

// Recent activity: Array<{ type: string, text: string, time: string, color: string }>
export const fetchAdminActivity = async () => {
  const response = await api.get("/admin/activity");
  return response.data;
};

export default api;
