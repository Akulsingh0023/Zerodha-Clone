import axios from "axios";
import API from "./config";
import { showGlobalToast } from "./utils/toast";

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
    if (!error.response) {
      showGlobalToast("Network error. Please try again.");
    }
    return Promise.reject(error);
  }
);
