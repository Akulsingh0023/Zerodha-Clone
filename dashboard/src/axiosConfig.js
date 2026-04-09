import axios from "axios";
import API from "./config";

axios.defaults.baseURL = API;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silent fail on API/network errors: no global toast/alert.
    return Promise.reject(error);
  }
);
