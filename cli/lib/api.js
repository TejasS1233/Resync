import axios from "axios";
import Conf from "conf";
import chalk from "chalk";

const config = new Conf({ projectName: "resync-cli" });

// Function to get the current API URL
function getBaseURL() {
  return (
    process.env.API_URL || config.get("apiUrl") || "http://localhost:8000/api"
  );
}

// Create axios instance with base configuration
const api = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to set baseURL and add auth token
api.interceptors.request.use(
  (requestConfig) => {
    // Set baseURL dynamically
    requestConfig.baseURL = getBaseURL();

    // Add auth token
    const token = getToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized
      if (status === 401) {
        console.error(
          chalk.red("\n✖ Authentication failed. Please login again.")
        );
        clearAuth();
        process.exit(1);
      }

      // Handle other errors with user-friendly messages
      const message = data?.message || error.message || "An error occurred";
      error.userMessage = message;
    } else if (error.request) {
      error.userMessage =
        "Unable to connect to server. Please ensure the backend is running.";
    } else {
      error.userMessage = error.message;
    }

    return Promise.reject(error);
  }
);

// Config helper functions
export function getToken() {
  return config.get("token");
}

export function setToken(token) {
  config.set("token", token);
}

export function getUser() {
  return config.get("user");
}

export function setUser(user) {
  config.set("user", user);
}

export function clearAuth() {
  config.delete("token");
  config.delete("user");
}

export function isAuthenticated() {
  return !!getToken();
}

export function getApiUrl() {
  return getBaseURL();
}

export function setApiUrl(url) {
  config.set("apiUrl", url);
}

export default api;
