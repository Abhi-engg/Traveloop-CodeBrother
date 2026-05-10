import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "traveloop_token";

/* ── Bootstrap: set token immediately from localStorage ────────── */
const storedToken = localStorage.getItem(TOKEN_KEY);

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: storedToken
    ? { Authorization: `Bearer ${storedToken}` }
    : {},
});

/* ── Auto-logout on 401 ────────────────────────────────────────── */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/")
    ) {
      // Token is expired or invalid — clear it and redirect
      localStorage.removeItem(TOKEN_KEY);
      delete apiClient.defaults.headers.common.Authorization;
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }
  delete apiClient.defaults.headers.common.Authorization;
};
