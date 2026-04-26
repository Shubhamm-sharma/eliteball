import axios from "axios";
import config from "./config";
import * as URL from "./apiEndpoint";

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((requestConfig) => {
  const adminSession = sessionStorage.getItem("adminSession");

  if (adminSession) {
    try {
      const { token } = JSON.parse(adminSession);
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      sessionStorage.removeItem("adminSession");
    }
  }

  return requestConfig;
});

const unwrap = (response) => response.data?.data ?? response.data;

export const getMatches = async (params = {}) => {
  const response = await api.get(URL.MATCHES, { params });
  return unwrap(response);
};

export const getMatchById = async (matchId) => {
  const response = await api.get(URL.matchById(matchId));
  return unwrap(response);
};

export const getMatchLiveState = async (matchId) => {
  const response = await api.get(URL.matchLiveState(matchId));
  return unwrap(response);
};

export const getTeams = async () => {
  const response = await api.get(URL.TEAMS);
  return unwrap(response);
};

export default api;
