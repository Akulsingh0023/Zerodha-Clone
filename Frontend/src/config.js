const API = import.meta.env.VITE_API_URL;
const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  "https://zerodha-clone-gamma-rose.vercel.app";
const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL ||
  "https://zerodha-clone-s4ag.vercel.app";

export { API, SITE_URL, DASHBOARD_URL };
export default API;
