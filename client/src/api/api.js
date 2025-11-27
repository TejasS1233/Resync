import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Goals API
export const goalAPI = {
  // Get all goals
  getAllGoals: async () => {
    const response = await api.get("/goals");
    return response.data;
  },

  // Get single goal
  getGoal: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  // Create goal
  createGoal: async (goalData) => {
    const response = await api.post("/goals", goalData);
    return response.data;
  },

  // Update goal
  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  // Delete goal
  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  // Update progress
  updateProgress: async (id, completed) => {
    const response = await api.patch(`/goals/${id}/progress`, { completed });
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await api.get("/goals/stats");
    return response.data;
  },
};

export default api;
