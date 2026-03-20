import axios from "axios";
import API from "../config";
import { showGlobalToast } from "./toast";

/**
 * Auto Square-Off Service
 * ───────────────────────
 * Uses setInterval to check system time every 30 seconds.
 * At exactly 15:20, calls the backend API to square off all
 * open MIS positions, updates localStorage, and dispatches
 * the "walletUpdated" event so existing components re-render.
 *
 * This module is a side-effect import — just importing it starts
 * the scheduler. No component modifications needed.
 */

const SQUARE_OFF_HOUR = 15;
const SQUARE_OFF_MINUTE = 20;
const CHECK_INTERVAL_MS = 30_000; // 30 seconds
const BASE_URL = API;

let triggeredToday = false;

const runSquareOff = async () => {
  const token = localStorage.getItem("token");
  if (!token) return; // not logged in

  try {
    const res = await axios.post(
      `${BASE_URL}/api/square-off`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    const data = res.data;
    if (!data.success || data.squared === 0) return;

    // Update localStorage: clear positions
    localStorage.setItem("zerodha_positions", JSON.stringify([]));

    // Fetch and cache updated orders
    try {
      const ordersRes = await axios.get(`${BASE_URL}/newOrder`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (Array.isArray(ordersRes.data)) {
        localStorage.setItem("zerodha_orders", JSON.stringify(ordersRes.data));
      }
    } catch {
      // non-critical
    }

    // Fetch and cache updated wallet balance
    try {
      const walletRes = await axios.get(`${BASE_URL}/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (walletRes.data?.success) {
        localStorage.setItem(
          "zerodha_walletBalance",
          String(walletRes.data.balance)
        );
      }
    } catch {
      // non-critical
    }

    // Dispatch event so all listening components (Positions, Orders, Wallet) re-render
    window.dispatchEvent(new Event("walletUpdated"));

  } catch (err) {
    showGlobalToast(
      err.response?.data?.message ||
        "Auto square-off failed. Please try again later."
    );
  }
};

// Scheduler: check time every 30 seconds
setInterval(() => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();

  if (h === SQUARE_OFF_HOUR && m === SQUARE_OFF_MINUTE) {
    if (!triggeredToday) {
      triggeredToday = true;
      runSquareOff();
    }
  } else {
    triggeredToday = false;
  }
}, CHECK_INTERVAL_MS);
