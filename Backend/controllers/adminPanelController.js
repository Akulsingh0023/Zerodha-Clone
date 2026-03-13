import User from "../model/User.js";
import OrdersModel from "../model/OrdersModel.js";
import HoldingsModel from "../model/HoldingsModel.js";
import PositionsModel from "../model/PositionsModel.js";
import WatchlistModel from "../model/WatchlistModel.js";
import WalletTransaction from "../model/WalletTransaction.js";
import StockModel from "../model/StockModel.js";
import bcrypt from "bcryptjs";

/* ============================
   📊 DASHBOARD STATS
============================ */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalOrders,
      tradesToday,
      deposits,
      withdrawals,
      activeUsersResult,
    ] = await Promise.all([
      User.countDocuments(),
      OrdersModel.countDocuments(),
      OrdersModel.countDocuments({ createdAt: { $gte: today } }),
      WalletTransaction.aggregate([
        { $match: { type: "credit", reason: "manual_add" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      WalletTransaction.aggregate([
        { $match: { type: "debit", reason: "withdraw" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      OrdersModel.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: "$user" } },
        { $count: "count" },
      ]),
    ]);

    // Platform revenue = sum of all stock_buy debits (brokerage approximation)
    const revenueResult = await WalletTransaction.aggregate([
      { $match: { type: "debit", reason: "stock_buy" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      totalOrders,
      tradesToday,
      totalDeposits: deposits[0]?.total || 0,
      totalWithdrawals: withdrawals[0]?.total || 0,
      platformRevenue: Math.round((revenueResult[0]?.total || 0) * 0.0003), // 0.03% brokerage
      activeUsers: activeUsersResult[0]?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   📈 CHARTS DATA
============================ */
export const getChartsData = async (req, res) => {
  try {
    // Users growth - last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usersGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Daily trading volume - last 30 days
    const tradingVolume = await OrdersModel.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          volume: { $sum: { $multiply: ["$qty", "$price"] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue - last 30 days
    const revenue = await WalletTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          type: "debit",
          reason: "stock_buy",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ usersGrowth, tradingVolume, revenue });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   👥 GET ALL USERS
============================ */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   🔍 GET USER DETAILS
============================ */
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   🚫 BLOCK / UNBLOCK USER
============================ */
export const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot block yourself" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({ message: `User ${user.blocked ? "blocked" : "unblocked"}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   👤 DELETE USER
============================ */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    // Clean up user data
    await Promise.all([
      OrdersModel.deleteMany({ user: userId }),
      HoldingsModel.deleteMany({ user: userId }),
      PositionsModel.deleteMany({ user: userId }),
      WatchlistModel.deleteMany({ user: userId }),
      WalletTransaction.deleteMany({ userId }),
    ]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   👑 CHANGE USER ROLE
============================ */
export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   📦 ALL ORDERS
============================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find().populate("user", "fullname email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   ❌ CANCEL ORDER
============================ */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrdersModel.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   📊 ALL HOLDINGS
============================ */
export const getAllHoldings = async (req, res) => {
  try {
    const holdings = await HoldingsModel.find().populate("user", "fullname email");
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   👁️ ALL WATCHLIST
============================ */
export const getAllWatchlist = async (req, res) => {
  try {
    const items = await WatchlistModel.find().populate("user", "fullname email").sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   💰 ALL WALLET TRANSACTIONS
============================ */
export const getAllTransactions = async (req, res) => {
  try {
    const txns = await WalletTransaction.find().populate("userId", "fullname email").sort({ createdAt: -1 });
    res.json(txns);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   💵 ADD FUNDS TO USER
============================ */
export const addFundsToUser = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const num = Number(amount);
    if (!num || num <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: num } },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    await WalletTransaction.create({ userId, type: "credit", amount: num, reason: "manual_add" });

    res.json({ message: "Funds added", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   📈 STOCK MANAGEMENT
============================ */
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await StockModel.find().sort({ name: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addStock = async (req, res) => {
  try {
    const { name, price, change, changePercent, marketCap } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Name and price required" });

    const stock = await StockModel.create({
      name: name.trim().toUpperCase(),
      price: Number(price),
      change: Number(change) || 0,
      changePercent: Number(changePercent) || 0,
      marketCap: marketCap || "",
    });

    res.status(201).json(stock);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Stock already exists" });
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const updates = {};
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.change !== undefined) updates.change = Number(req.body.change);
    if (req.body.changePercent !== undefined) updates.changePercent = Number(req.body.changePercent);
    if (req.body.marketCap !== undefined) updates.marketCap = req.body.marketCap;

    const stock = await StockModel.findByIdAndUpdate(stockId, updates, { new: true });
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const stock = await StockModel.findByIdAndDelete(stockId);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.json({ message: "Stock deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   📊 GET ADMIN STATISTICS (legacy)
============================ */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });
    res.json({ totalUsers, totalAdmins, totalRegularUsers, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   🔐 GET CURRENT ADMIN INFO
============================ */
export const getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   🔐 UPDATE ADMIN PROFILE
============================ */
export const updateAdminProfile = async (req, res) => {
  try {
    const { fullname } = req.body;
    const admin = await User.findByIdAndUpdate(
      req.user._id,
      { fullname },
      { new: true }
    ).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   🔐 CHANGE ADMIN PASSWORD
============================ */
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
