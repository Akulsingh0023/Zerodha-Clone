import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getChartsData,
  getAllUsers,
  getUserDetails,
  toggleBlockUser,
  deleteUser,
  changeUserRole,
  getAllOrders,
  cancelOrder,
  getAllHoldings,
  getAllWatchlist,
  getAllTransactions,
  addFundsToUser,
  getAllStocks,
  addStock,
  updateStock,
  deleteStock,
  getAdminStats,
  getAdminInfo,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/adminPanelController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);
router.get("/charts", protect, adminOnly, getChartsData);

// Users
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:userId", protect, adminOnly, getUserDetails);
router.delete("/users/:userId", protect, adminOnly, deleteUser);
router.put("/users/:userId/role", protect, adminOnly, changeUserRole);
router.put("/users/:userId/block", protect, adminOnly, toggleBlockUser);

// Orders
router.get("/orders", protect, adminOnly, getAllOrders);
router.delete("/orders/:orderId", protect, adminOnly, cancelOrder);

// Holdings
router.get("/holdings", protect, adminOnly, getAllHoldings);

// Watchlist
router.get("/watchlist", protect, adminOnly, getAllWatchlist);

// Transactions / Wallet
router.get("/transactions", protect, adminOnly, getAllTransactions);
router.post("/funds/add", protect, adminOnly, addFundsToUser);

// Stocks
router.get("/stocks", protect, adminOnly, getAllStocks);
router.post("/stocks", protect, adminOnly, addStock);
router.put("/stocks/:stockId", protect, adminOnly, updateStock);
router.delete("/stocks/:stockId", protect, adminOnly, deleteStock);

// Legacy stats
router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/info", protect, adminOnly, getAdminInfo);

// Settings
router.put("/profile", protect, adminOnly, updateAdminProfile);
router.put("/change-password", protect, adminOnly, changeAdminPassword);

export default router;
