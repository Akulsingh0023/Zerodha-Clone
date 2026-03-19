// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { HoldingsModel } = require("./model/HoldingsModel.js");
// const { PositionsModel } = require("./model/PositionsModel.js");
// const {OrdersModel} = require("./model/OrdersModel.js")
// const authRoutes= require("./routes/authRoutes.js");
// const app = express();

// const PORT = process.env.PORT || 4000;
// const url = process.env.MONGO_URL;
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/api/auth", authRoutes);
//no
// app.get("/addHoldings", async (req,res) => {
//     let tempHoldings = [
//   {
//     name: "BHARTIARTL",
//     qty: 2,
//     avg: 538.05,
//     price: 541.15,
//     net: "+0.58%",
//     day: "+2.99%",
//   },
//   {
//     name: "HDFCBANK",
//     qty: 2,
//     avg: 1383.4,
//     price: 1522.35,
//     net: "+10.04%",
//     day: "+0.11%",
//   },
//   {
//     name: "HINDUNILVR",
//     qty: 1,
//     avg: 2335.85,
//     price: 2417.4,
//     net: "+3.49%",
//     day: "+0.21%",
//   },
//   {
//     name: "INFY",
//     qty: 1,
//     avg: 1350.5,
//     price: 1555.45,
//     net: "+15.18%",
//     day: "-1.60%",
//     isLoss: true,
//   },
//   {
//     name: "ITC",
//     qty: 5,
//     avg: 202.0,
//     price: 207.9,
//     net: "+2.92%",
//     day: "+0.80%",
//   },
//   {
//     name: "KPITTECH",
//     qty: 5,
//     avg: 250.3,
//     price: 266.45,
//     net: "+6.45%",
//     day: "+3.54%",
//   },
//   {
//     name: "M&M",
//     qty: 2,
//     avg: 809.9,
//     price: 779.8,
//     net: "-3.72%",
//     day: "-0.01%",
//     isLoss: true,
//   },
//   {
//     name: "RELIANCE",
//     qty: 1,
//     avg: 2193.7,
//     price: 2112.4,
//     net: "-3.71%",
//     day: "+1.44%",
//   },
//   {
//     name: "SBIN",
//     qty: 4,
//     avg: 324.35,
//     price: 430.2,
//     net: "+32.63%",
//     day: "-0.34%",
//     isLoss: true,
//   },
//   {
//     name: "SGBMAY29",
//     qty: 2,
//     avg: 4727.0,
//     price: 4719.0,
//     net: "-0.17%",
//     day: "+0.15%",
//   },
//   {
//     name: "TATAPOWER",
//     qty: 5,
//     avg: 104.2,
//     price: 124.15,
//     net: "+19.15%",
//     day: "-0.24%",
//     isLoss: true,
//   },
//   {
//     name: "TCS",
//     qty: 1,
//     avg: 3041.7,
//     price: 3194.8,
//     net: "+5.03%",
//     day: "-0.25%",
//     isLoss: true,
//   },
//   {
//     name: "WIPRO",
//     qty: 4,
//     avg: 489.3,
//     price: 577.75,
//     net: "+18.08%",
//     day: "+0.32%",
//   },
// ];

// tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//          name: item.name,
//   qty: item.qty,
//   avg: item.avg,
//   price: item.price,
//   net: item.net,
//   day: item.day,
//     });
//     newHolding.save();
// });
// res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];
//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//    product: item.product,
//     name: item.name,
//     qty: item.qty,
//     avg: item.avg,
//     price: item.price,
//     net: item.net,
//     day: item.day,
//     isLoss: item.isLoss,
//     });
//     newPosition.save();
//   });
//    res.send("Positions inserted successfully ")
// });



// app.get("/allHoldings", async (req,res) => {
//     let allHoldings = await HoldingsModel.find({});
//     res.json(allHoldings);
// });

// app.get("/allPositions", async (req,res) => {
//     let allPositions = await PositionsModel.find({});
//     res.json(allPositions);
// });

// app.get("/newOrder", async (req,res) => {
//     let newOrder = await OrdersModel.find({});
//     res.json(newOrder);
// });

// app.post("/newOrder", (req,res) => {
//   let newOrder = new OrdersModel({
//      name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     mode: req.body.mode,
//   });
//   newOrder.save();

//   res.send("Order saved")
// })
// app.listen(PORT, () => {
//   console.log("Server is running");
//   mongoose.connect(url);
//   console.log("DB connected");
// });

// require("dotenv").config();
// const axios = require("axios");
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { HoldingsModel } = require("./model/HoldingsModel.js");
// const { PositionsModel } = require("./model/PositionsModel.js");
// const {OrdersModel} = require("./model/OrdersModel.js")
// const authRoutes= require("./routes/authRoutes.js");
// const app = express();

// const PORT = process.env.PORT || 4000;
// const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
// const url = process.env.MONGO_URL;
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/api/auth", authRoutes);
// /* ================= DB CONNECT ================= */
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err));

// /* ================= ROUTES ================= */

// /* 🔹 GET HOLDINGS */
// app.get("/allHoldings", async (req, res) => {
//   const holdings = await HoldingsModel.find({});
//   res.json(holdings);
// });

// app.get("/allPositions", async (req,res) => {
//     let allPositions = await PositionsModel.find({});
//     res.json(allPositions);
// });

// /* 🔹 GET ORDERS */
// app.get("/newOrder", async (req, res) => {
//   const orders = await OrdersModel.find({});
//   res.json(orders);
// });

// app.get("/livePrice/:symbol", async (req, res) => {
//   try {
//     const symbol = req.params.symbol;

//     const response = await axios.get(
//       "https://www.alphavantage.co/query",
//       {
//         params: {
//           function: "GLOBAL_QUOTE",
//           symbol: symbol,
//           apikey: process.env.ALPHA_VANTAGE_KEY,
//         },
//       }
//     );

//     const price =
//       response.data["Global Quote"]["05. price"];

//     res.json({
//       symbol,
//       price: Number(price),
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Price fetch failed" });
//   }
// });


// /* 🔹 BUY ORDER (ZERODHA LOGIC) */
// app.post("/newOrder", async (req, res) => {
//   try {
//     const { name, qty, price, mode } = req.body;

//     /* 1️⃣ Save ORDER */
//     const newOrder = new OrdersModel({
//       name,
//       qty,
//       price,
//       mode,
//     });
//     await newOrder.save();

//     /* 2️⃣ BUY → HOLDINGS UPDATE */
//     if (mode === "BUY") {
//       const existingHolding = await HoldingsModel.findOne({ name });

//       if (existingHolding) {
//         // 🧠 Zerodha avg calculation
//         const totalQty = existingHolding.qty + Number(qty);
//         const totalCost =
//           existingHolding.qty * existingHolding.avg +
//           Number(qty) * Number(price);

//         existingHolding.avg = totalCost / totalQty;
//         existingHolding.qty = totalQty;
//         existingHolding.price = price; // latest price
//         existingHolding.net = "+0.00%";
//         existingHolding.day = "+0.00%";

//         await existingHolding.save();
//       } else {
//         // 🆕 New stock
//         const newHolding = new HoldingsModel({
//           name,
//           qty,
//           avg: price,
//           price,
//           net: "+0.00%",
//           day: "+0.00%",
//         });
//         await newHolding.save();
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order placed successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// });

// /* ================= SERVER ================= */
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// require("dotenv").config();
// const axios = require("axios");
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const { HoldingsModel } = require("./model/HoldingsModel.js");
// const { PositionsModel } = require("./model/PositionsModel.js");
// const { OrdersModel } = require("./model/OrdersModel.js");
// const authRoutes = require("./routes/authRoutes.js");

// const app = express();

// /* ================= CONFIG ================= */
// const PORT = process.env.PORT || 4000;
// const API_KEY = process.env.ALPHA_VANTAGE_KEY;

// /* ================= MIDDLEWARE ================= */
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/api/auth", authRoutes);

// /* ================= DB CONNECT ================= */
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err));

// /* ================= ROUTES ================= */

// /* 🔹 GET HOLDINGS */
// app.get("/allHoldings", async (req, res) => {
//   const holdings = await HoldingsModel.find({});
//   res.json(holdings);
// });

// /* 🔹 GET POSITIONS */
// app.get("/allPositions", async (req, res) => {
//   const allPositions = await PositionsModel.find({});
//   res.json(allPositions);
// });

// /* 🔹 GET ORDERS */
// app.get("/newOrder", async (req, res) => {
//   const orders = await OrdersModel.find({});
//   res.json(orders);
// });

// /* =====================================================
//    🔥 LIVE PRICE API (ALPHA VANTAGE – INDIA WORKING)
//    ===================================================== */
// app.get("/api/live-price/:symbol", async (req, res) => {
//   try {
//     const symbol = req.params.symbol; // e.g. TCS.BSE

//     const response = await axios.get(
//       "https://www.alphavantage.co/query",
//       {
//         params: {
//           function: "TIME_SERIES_INTRADAY",
//           symbol,
//           interval: "5min",
//           apikey: API_KEY,
//         },
//       }
//     );

//     const series = response.data["Time Series (5min)"];

//     if (!series) {
//       return res.status(404).json({
//         error: "No market data (API limit or invalid symbol)",
//       });
//     }

//     const latestTime = Object.keys(series)[0];
//     const latestData = series[latestTime];

//     res.json({
//       symbol,
//       ltp: Number(latestData["4. close"]),
//       time: latestTime,
//     });
//   } catch (error) {
//     console.log("Alpha Vantage Error:", error.message);
//     res.status(500).json({ error: "Price fetch failed" });
//   }
// });

// /* =====================================================
//    🔹 BUY ORDER (ZERODHA-STYLE LOGIC)
//    ===================================================== */
// app.post("/newOrder", async (req, res) => {
//   try {
//     const { name, qty, price, mode } = req.body;

//     /* 1️⃣ Save ORDER */
//     const newOrder = new OrdersModel({
//       name,
//       qty,
//       price,
//       mode,
//     });
//     await newOrder.save();

//     /* 2️⃣ BUY → HOLDINGS UPDATE */
//     if (mode === "BUY") {
//       const existingHolding = await HoldingsModel.findOne({ name });

//       if (existingHolding) {
//         // Zerodha avg price logic
//         const totalQty = existingHolding.qty + Number(qty);
//         const totalCost =
//           existingHolding.qty * existingHolding.avg +
//           Number(qty) * Number(price);

//         existingHolding.avg = totalCost / totalQty;
//         existingHolding.qty = totalQty;
//         existingHolding.price = price;

//         await existingHolding.save();
//       } else {
//         // New stock
//         const newHolding = new HoldingsModel({
//           name,
//           qty,
//           avg: price,
//           price,
//           net: "+0.00%",
//           day: "+0.00%",
//         });
//         await newHolding.save();
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order placed successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// });

// /* ================= SERVER ================= */
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


//ye
// require("dotenv").config();
// const axios = require("axios");
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const { HoldingsModel } = require("./model/HoldingsModel.js");
// const { PositionsModel } = require("./model/PositionsModel.js");
// const { OrdersModel } = require("./model/OrdersModel.js");
// const authRoutes = require("./routes/authRoutes.js");

// const app = express();

// /* ================= CONFIG ================= */
// const PORT = process.env.PORT || 4000;

// /* ================= MIDDLEWARE ================= */
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/api/auth", authRoutes);

// /* ================= DB CONNECT ================= */
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("✅ DB connected"))
//   .catch((err) => console.log("❌ DB error:", err));

// /* ================= ROUTES ================= */

// /* 🔹 GET HOLDINGS */
// app.get("/allHoldings", async (req, res) => {
//   const holdings = await HoldingsModel.find({});
//   res.json(holdings);
// });

// /* 🔹 GET POSITIONS */
// app.get("/allPositions", async (req, res) => {
//   const allPositions = await PositionsModel.find({});
//   res.json(allPositions);
// });

// /* 🔹 GET ORDERS */
// app.get("/newOrder", async (req, res) => {
//   const orders = await OrdersModel.find({});
//   res.json(orders);
// });

// /* =====================================================
//    🔥 LIVE PRICE API — YAHOO FINANCE (NO API KEY)
//    ===================================================== */
// app.get("/api/live-price/:symbol", async (req, res) => {
//   try {
//     const symbol = req.params.symbol.toUpperCase(); // TCS

//     const response = await axios.get(
//       `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`,
//       {
//         headers: {
//           "User-Agent": "Mozilla/5.0",
//           Accept: "application/json",
//           "Accept-Language": "en-US,en;q=0.9",
//           Referer: "https://www.nseindia.com/",
//         },
//       }
//     );

//     const priceInfo = response.data.priceInfo;

//     res.json({
//       symbol,
//       ltp: priceInfo.lastPrice,
//       change: priceInfo.change,
//       changePercent: priceInfo.pChange,
//     });
//   } catch (error) {
//     console.log("NSE API ERROR");
//     res.status(500).json({ error: "Price fetch failed" });
//   }
// });

// /* =====================================================
//    🔹 BUY ORDER (ZERODHA-STYLE LOGIC)
//    ===================================================== */
// app.post("/newOrder", async (req, res) => {
//   try {
//     const { name, qty, price, mode } = req.body;

//     /* 1️⃣ Save order */
//     const newOrder = new OrdersModel({
//       name,
//       qty,
//       price,
//       mode,
//     });
//     await newOrder.save();

//     /* 2️⃣ BUY → HOLDINGS UPDATE */
//     if (mode === "BUY") {
//       const existingHolding = await HoldingsModel.findOne({ name });

//       if (existingHolding) {
//         const totalQty = existingHolding.qty + Number(qty);
//         const totalCost =
//           existingHolding.qty * existingHolding.avg +
//           Number(qty) * Number(price);

//         existingHolding.qty = totalQty;
//         existingHolding.avg = totalCost / totalQty;
//         existingHolding.price = price;

//         await existingHolding.save();
//       } else {
//         const newHolding = new HoldingsModel({
//           name,
//           qty,
//           avg: price,
//           price,
//           net: "+0.00%",
//           day: "+0.00%",
//         });
//         await newHolding.save();
//       }
//     }

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// });

// /* ================= SERVER ================= */
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
//bhai
// require("dotenv").config();
// const axios = require("axios");
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const { HoldingsModel } = require("./model/HoldingsModel.js");
// const { PositionsModel } = require("./model/PositionsModel.js");
// const { OrdersModel } = require("./model/OrdersModel.js");
// const authRoutes = require("./routes/authRoutes.js");

// const app = express();

// /* ================= CONFIG ================= */
// const PORT = process.env.PORT || 4000;

// /* ================= MIDDLEWARE ================= */
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/api/auth", authRoutes);

// /* ================= DB CONNECT ================= */
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("✅ DB connected"))
//   .catch((err) => console.log("❌ DB error:", err));

// /* ================= ROUTES ================= */

// /* 🔹 GET HOLDINGS */
// app.get("/allHoldings", async (req, res) => {
//   const holdings = await HoldingsModel.find({});
//   res.json(holdings);
// });

// /* 🔹 GET POSITIONS */
// app.get("/allPositions", async (req, res) => {
//   const positions = await PositionsModel.find({});
//   res.json(positions);
// });

// /* 🔹 GET ORDERS */
// app.get("/newOrder", async (req, res) => {
//   const orders = await OrdersModel.find({});
//   res.json(orders);
// });

// /* =====================================================
//    🔥 LIVE PRICE API (NSE – SAME AS YOUR CODE)
//    ===================================================== */
// app.get("/api/live-price/:symbol", async (req, res) => {
//   try {
//     const symbol = req.params.symbol.toUpperCase();

//     const response = await axios.get(
//       `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`,
//       {
//         headers: {
//           "User-Agent": "Mozilla/5.0",
//           Accept: "application/json",
//           Referer: "https://www.nseindia.com/",
//         },
//       }
//     );

//     const priceInfo = response.data.priceInfo;

//     res.json({
//       symbol,
//       ltp: priceInfo.lastPrice,
//       change: priceInfo.change,
//       changePercent: priceInfo.pChange,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Price fetch failed" });
//   }
// });

// /* =====================================================
//    🔹 BUY + SELL ORDER (FIXED PROPERLY)
//    ===================================================== */
// app.post("/newOrder", async (req, res) => {
//   try {
//     const { name, qty, price, mode } = req.body;

//     /* 1️⃣ SAVE ORDER (BUY + SELL BOTH) */
//     const newOrder = new OrdersModel({
//       name,
//       qty,
//       price,
//       mode,
//     });
//     await newOrder.save();

//     /* ================= BUY LOGIC ================= */
//     if (mode === "BUY") {
//       const existingHolding = await HoldingsModel.findOne({ name });

//       if (existingHolding) {
//         const totalQty = existingHolding.qty + Number(qty);
//         const totalCost =
//           existingHolding.qty * existingHolding.avg +
//           Number(qty) * Number(price);

//         existingHolding.qty = totalQty;
//         existingHolding.avg = totalCost / totalQty;
//         existingHolding.price = price;

//         await existingHolding.save();
//       } else {
//         const newHolding = new HoldingsModel({
//           name,
//           qty,
//           avg: price,
//           price,
//           net: "+0.00%",
//           day: "+0.00%",
//         });
//         await newHolding.save();
//       }
//     }

//     /* ================= SELL LOGIC (🔥 FIXED) ================= */
//     if (mode === "SELL") {
//       const existingHolding = await HoldingsModel.findOne({ name });

//       if (!existingHolding) {
//         return res.status(400).json({
//           success: false,
//           message: "No holdings found to sell",
//         });
//       }

//       if (existingHolding.qty < qty) {
//         return res.status(400).json({
//           success: false,
//           message: "Not enough quantity to sell",
//         });
//       }

//       /* Reduce qty */
//       existingHolding.qty -= Number(qty);

//       /* If qty becomes 0 → delete holding */
//       if (existingHolding.qty === 0) {
//         await HoldingsModel.deleteOne({ name });
//       } else {
//         await existingHolding.save();
//       }
//     }

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// });

// /* ================= SERVER ================= */
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

import dotenv from "dotenv";
import axios from "axios";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import  HoldingsModel  from "./model/HoldingsModel.js";
import  PositionsModel  from "./model/PositionsModel.js";
import  OrdersModel  from "./model/OrdersModel.js";
import WatchlistModel from "./model/WatchlistModel.js";
import WalletTransaction from "./model/WalletTransaction.js";
import User from "./model/User.js";
import { protect } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminPanelRoutes from "./routes/adminPanelRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import squareOffRoutes from "./routes/squareOffRoutes.js";
import { squareOffAllUsers } from "./controllers/squareOffController.js";

dotenv.config();

const app = express();

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 4000;
const IST_TIMEZONE = "Asia/Kolkata";
const SQUARE_OFF_HOUR = 15;
const SQUARE_OFF_MINUTE = 20;

const openMisFilter = {
  $and: [
    { $or: [{ productType: "MIS" }, { product: "MIS" }] },
    { $or: [{ status: "OPEN" }, { status: { $exists: false } }] },
  ],
};

const withOpenMis = (base = {}) => ({ ...base, ...openMisFilter });

/* ================= MIDDLEWARE ================= */

// CORS for multiple frontend ports
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


/* ================= AUTH ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-panel", adminPanelRoutes);
app.use("/api", profileRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/square-off", squareOffRoutes);
/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.log("❌ DB error:", err));

/* ================= ROUTES ================= */

/* =====================================================
   ⭐ WATCHLIST (separate from Orders)
===================================================== */

// GET watchlist for current user
app.get("/watchlist", protect, async (req, res) => {
  try {
    const items = await WatchlistModel.find({ user: req.user._id }).sort({ createdAt: 1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// POST add to watchlist
app.post("/watchlist", protect, async (req, res) => {
  try {
    const { symbol, name } = req.body;
    if (!symbol || typeof symbol !== "string") {
      return res.status(400).json({ error: "symbol is required" });
    }

    const sym = symbol.trim().toUpperCase();
    if (!sym) return res.status(400).json({ error: "symbol is required" });

    await WatchlistModel.findOneAndUpdate(
      { user: req.user._id, symbol: sym },
      { $set: { name: (name || "").toString() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const items = await WatchlistModel.find({ user: req.user._id }).sort({ createdAt: 1 });
    return res.json(items);
  } catch (error) {
    // Duplicate key (unique index) can happen in rare races
    if (error?.code === 11000) {
      const items = await WatchlistModel.find({ user: req.user._id }).sort({ createdAt: 1 });
      return res.json(items);
    }
    return res.status(500).json({ error: "Failed to add to watchlist" });
  }
});

// DELETE remove from watchlist
app.delete("/watchlist/:symbol", protect, async (req, res) => {
  try {
    const symbol = (req.params.symbol || "").trim().toUpperCase();
    if (!symbol) return res.status(400).json({ error: "symbol is required" });

    await WatchlistModel.deleteOne({ user: req.user._id, symbol });
    const items = await WatchlistModel.find({ user: req.user._id }).sort({ createdAt: 1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: "Failed to remove from watchlist" });
  }
});

/* 🔹 GET HOLDINGS */
app.get("/allHoldings", protect, async (req, res) => {
  try {
    // Return holdings only for the authenticated user
    const holdings = await HoldingsModel.find({ user: req.user._id });
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

// CNC holdings (alias)
app.get("/holdings", protect, async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ user: req.user._id });
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

/* 🔹 GET POSITIONS */
app.get("/allPositions", protect, async (req, res) => {
  try {
    const positions = await PositionsModel.find(withOpenMis({ user: req.user._id }));
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// MIS positions (preferred)
app.get("/positions", protect, async (req, res) => {
  try {
    const positions = await PositionsModel.find(withOpenMis({ user: req.user._id }));
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

/* 🔹 GET ORDERS */
// Backwards-compatible endpoint (now scoped to the authenticated user)
app.get("/newOrder", protect, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Preferred endpoint: only BUY orders (purchased orders)
app.get("/orders", protect, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ user: req.user._id, mode: "BUY" }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* =====================================================
   �🔥 LIVE PRICE API (NSE)
===================================================== */
app.get("/api/live-price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const response = await axios.get(
      `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
          Referer: "https://www.nseindia.com/",
        },
      }
    );

    const priceInfo = response.data.priceInfo;

    res.json({
      symbol,
      ltp: priceInfo.lastPrice,
      change: priceInfo.change,
      changePercent: priceInfo.pChange,
    });
  } catch (err) {
    res.status(500).json({ error: "Price fetch failed" });
  }
});

/* =====================================================
   🔹 GET USER WALLET
===================================================== */
app.get("/wallet", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("walletBalance");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, walletBalance: user.walletBalance || 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch wallet" });
  }
});

/* =====================================================
   🔹 WALLET ROUTES + BUY/SELL (atomic with sessions)
===================================================== */

// GET current balance
app.get("/wallet/balance", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("walletBalance");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, balance: user.walletBalance || 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch balance" });
  }
});

// GET transaction history
app.get("/wallet/transactions", protect, async (req, res) => {
  try {
    const txns = await WalletTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(txns);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

// POST add money (manual)
app.post("/wallet/add", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const num = Number(amount);
    if (!num || num <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: num } },
      { new: true }
    ).select("walletBalance");

    await WalletTransaction.create({ userId: req.user._id, type: "credit", amount: num, reason: "manual_add" });

    return res.json({ success: true, balance: updatedUser.walletBalance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to add money" });
  }
});

// POST withdraw money (manual)
app.post("/wallet/withdraw", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const num = Number(amount);
    if (!num || num <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, walletBalance: { $gte: num } },
      { $inc: { walletBalance: -num } },
      { new: true }
    ).select("walletBalance");

    if (!updatedUser) return res.status(400).json({ success: false, message: "Insufficient balance" });

    await WalletTransaction.create({ userId: req.user._id, type: "debit", amount: num, reason: "withdraw" });

    return res.json({ success: true, balance: updatedUser.walletBalance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to withdraw" });
  }
});

// BUY / SELL with mongoose session for atomicity
app.post("/newOrder", protect, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { name, qty, price, mode, product = "CNC" } = req.body;
    const userId = req.user._id;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!["CNC", "MIS"].includes(product)) {
      return res.status(400).json({ success: false, message: "Invalid product. Use CNC or MIS" });
    }

    const quantityNum = Number(qty);
    const priceNum = Number(price);

    await session.withTransaction(async () => {
      if (mode === "BUY") {
        const totalCost = quantityNum * priceNum;

        // Atomically decrement wallet if sufficient
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId, walletBalance: { $gte: totalCost } },
          { $inc: { walletBalance: -totalCost } },
          { new: true, session }
        ).select("walletBalance");

        if (!updatedUser) {
          throw { status: 400, message: "Insufficient wallet balance" };
        }

        if (product === "CNC") {
          // Update or create holding for user
          const existingHolding = await HoldingsModel.findOne({ name, user: userId }).session(session);

          if (existingHolding) {
            const totalQty = existingHolding.qty + quantityNum;
            const totalCostExisting = existingHolding.qty * existingHolding.avg + totalCost;
            existingHolding.qty = totalQty;
            existingHolding.avg = totalCostExisting / totalQty;
            existingHolding.price = priceNum;
            await existingHolding.save({ session });
          } else {
            await HoldingsModel.create(
              [
                { name, qty: quantityNum, avg: priceNum, price: priceNum, net: "+0.00%", day: "+0.00%", user: userId },
              ],
              { session }
            );
          }
        } else {
          // MIS: Update or create position for user
          const existingPosition = await PositionsModel.findOne(
            withOpenMis({ name, user: userId })
          ).session(session);

          if (existingPosition) {
            const totalQty = existingPosition.qty + quantityNum;
            const totalCostExisting = existingPosition.qty * existingPosition.avg + totalCost;
            existingPosition.qty = totalQty;
            existingPosition.avg = totalCostExisting / totalQty;
            existingPosition.price = priceNum;
            existingPosition.status = "OPEN";
            existingPosition.product = "MIS";
            existingPosition.productType = "MIS";
            await existingPosition.save({ session });
          } else {
            await PositionsModel.create(
              [
                {
                  name,
                  qty: quantityNum,
                  avg: priceNum,
                  price: priceNum,
                  net: "+0.00%",
                  day: "+0.00%",
                  product: "MIS",
                  productType: "MIS",
                  status: "OPEN",
                  user: userId,
                },
              ],
              { session }
            );
          }
        }

        // Save order (stored separately from watchlist)
        await OrdersModel.create(
          [{ name, qty: quantityNum, price: priceNum, mode: "BUY", product, user: userId }],
          { session }
        );

        // Wallet transaction
        await WalletTransaction.create(
          [ { userId: userId, type: "debit", amount: totalCost, reason: "stock_buy" } ],
          { session }
        );
      } else if (mode === "SELL") {
        const totalSellAmount = quantityNum * priceNum;

        if (product === "CNC") {
          const existingHolding = await HoldingsModel.findOne({ name, user: userId }).session(session);
          if (!existingHolding || existingHolding.qty < quantityNum) {
            throw { status: 400, message: "Not enough shares to sell" };
          }

          // Credit wallet
          await User.findByIdAndUpdate(userId, { $inc: { walletBalance: totalSellAmount } }, { new: true, session }).select("walletBalance");

          // Reduce or delete holding
          existingHolding.qty -= quantityNum;
          if (existingHolding.qty <= 0) {
            await HoldingsModel.deleteOne({ _id: existingHolding._id }, { session });
          } else {
            await existingHolding.save({ session });
          }
        } else {
          const existingPosition = await PositionsModel.findOne(
            withOpenMis({ name, user: userId })
          ).session(session);
          if (!existingPosition || existingPosition.qty < quantityNum) {
            throw { status: 400, message: "Not enough quantity to close position" };
          }

          // Credit wallet
          await User.findByIdAndUpdate(userId, { $inc: { walletBalance: totalSellAmount } }, { new: true, session }).select("walletBalance");

          // Reduce or delete position
          existingPosition.qty -= quantityNum;
          if (existingPosition.qty <= 0) {
            existingPosition.qty = 0;
            existingPosition.price = priceNum;
            existingPosition.status = "CLOSED";
            existingPosition.product = "MIS";
            existingPosition.productType = "MIS";
            await existingPosition.save({ session });
          } else {
            existingPosition.price = priceNum;
            existingPosition.status = "OPEN";
            existingPosition.product = "MIS";
            existingPosition.productType = "MIS";
            await existingPosition.save({ session });
          }
        }

        // Save order and txn
        await OrdersModel.create(
          [{ name, qty: quantityNum, price: priceNum, mode: "SELL", product, user: userId }],
          { session }
        );
        await WalletTransaction.create(
          [ { userId: userId, type: "credit", amount: totalSellAmount, reason: "stock_sell" } ],
          { session }
        );
      } else {
        throw { status: 400, message: "Invalid mode. Use BUY or SELL" };
      }
    });

    session.endSession();
    return res.json({ success: true, message: `${req.body.mode} order executed` });
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    session.endSession();
    if (err && err.status) return res.status(err.status).json({ success: false, message: err.message });
    console.error(err);
    return res.status(500).json({ success: false, message: "Order failed", error: err.message || err });
  }
});

/* ================= AUTO SQUARE-OFF SCHEDULER ================= */
let lastSquareOffDate = null;

const getIstParts = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const map = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  return map;
};

cron.schedule(
  "* * * * *",
  () => {
    const { year, month, day, hour, minute } = getIstParts();
    const dateKey = `${year}-${month}-${day}`;

    if (Number(hour) === SQUARE_OFF_HOUR && Number(minute) === SQUARE_OFF_MINUTE) {
      if (lastSquareOffDate === dateKey) return;
      lastSquareOffDate = dateKey;
      console.log("Intraday auto square-off executed at 3:20 PM");
      squareOffAllUsers().catch((err) =>
        console.error("[Scheduler] Square-off error:", err.message)
      );
    }
  },
  { timezone: IST_TIMEZONE }
);

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const { HoldingsModel } = require("./model/HoldingsModel");
// const { PositionsModel } = require("./model/PositionsModel");
// const { OrdersModel } = require("./model/OrdersModel");

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(express.json());
// app.use(cors());

// /* ================= DB CONNECT ================= */
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("✅ DB Connected"))
//   .catch((err) => console.log(err));

// /* =====================================================
//    🔥 RANDOM LIVE PRICE GENERATOR
//    ===================================================== */

// const livePrices = {};

// function generateRandomPrice(base) {
//   const change = (Math.random() - 0.5) * 5; // random +-5
//   return Number((base + change).toFixed(2));
// }

// app.get("/api/live-price/:symbol", async (req, res) => {
//   const symbol = req.params.symbol.toUpperCase();

//   if (!livePrices[symbol]) {
//     livePrices[symbol] = 100 + Math.random() * 400;
//   }

//   livePrices[symbol] = generateRandomPrice(livePrices[symbol]);

//   const changePercent = ((Math.random() - 0.5) * 2).toFixed(2);

//   res.json({
//     symbol,
//     ltp: livePrices[symbol],
//     changePercent: Number(changePercent),
//   });
// });

// /* =====================================================
//    🔹 GET HOLDINGS
//    ===================================================== */
// app.get("/allHoldings", async (req, res) => {
//   const holdings = await HoldingsModel.find({});
//   res.json(holdings);
// });

// /* =====================================================
//    🔹 GET POSITIONS
//    ===================================================== */
// app.get("/allPositions", async (req, res) => {
//   const positions = await PositionsModel.find({});
//   res.json(positions);
// });

// /* =====================================================
//    🔹 BUY ORDER
//    ===================================================== */
// app.post("/newOrder", async (req, res) => {
//   try {
//     let { name, qty, price, product } = req.body;

//     qty = Number(qty);
//     price = Number(price);

//     if (!name || qty <= 0 || price <= 0) {
//       return res.status(400).json({ message: "Invalid input" });
//     }

//     /* ===== HOLDINGS UPDATE ===== */
//     let holding = await HoldingsModel.findOne({ name });

//     if (holding) {
//       const totalQty = holding.qty + qty;
//       const totalCost = holding.qty * holding.avg + qty * price;

//       holding.qty = totalQty;
//       holding.avg = totalCost / totalQty;
//       holding.price = price;
//       await holding.save();
//     } else {
//       await HoldingsModel.create({
//         name,
//         qty,
//         avg: price,
//         price,
//         net: "0%",
//         day: "0%",
//       });
//     }

//     /* ===== POSITIONS UPDATE ===== */
//     let position = await PositionsModel.findOne({ name });

//     if (position) {
//       const totalQty = position.qty + qty;
//       const totalCost = position.qty * position.avg + qty * price;

//       position.qty = totalQty;
//       position.avg = totalCost / totalQty;
//       position.price = price;
//       await position.save();
//     } else {
//       await PositionsModel.create({
//         product: product || "CNC",
//         name,
//         qty,
//         avg: price,
//         price,
//         net: "0%",
//         day: "0%",
//         isLoss: false,
//       });
//     }

//     await OrdersModel.create({
//       name,
//       qty,
//       price,
//       mode: "BUY",
//     });

//     res.json({ success: true, message: "BUY Success" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /* =====================================================
//    🔹 SELL ORDER
//    ===================================================== */
// app.post("/sellOrder", async (req, res) => {
//   try {
//     let { name, qty, price } = req.body;

//     qty = Number(qty);
//     price = Number(price);

//     const holding = await HoldingsModel.findOne({ name });
//     const position = await PositionsModel.findOne({ name });

//     if (!holding || holding.qty < qty) {
//       return res.status(400).json({ message: "Insufficient qty" });
//     }

//     /* ===== HOLDING REDUCE ===== */
//     holding.qty -= qty;
//     holding.price = price;

//     if (holding.qty === 0) {
//       await HoldingsModel.deleteOne({ name });
//     } else {
//       await holding.save();
//     }

//     /* ===== POSITION REDUCE ===== */
//     if (position) {
//       position.qty -= qty;
//       position.price = price;

//       if (position.qty === 0) {
//         await PositionsModel.deleteOne({ name });
//       } else {
//         await position.save();
//       }
//     }

//     await OrdersModel.create({
//       name,
//       qty,
//       price,
//       mode: "SELL",
//     });

//     res.json({ success: true, message: "SELL Success" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /* ===================================================== */

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
