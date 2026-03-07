import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    name: String,
    qty: Number,
    price: Number,
    mode: {
      type: String,
      enum: ["BUY", "SELL", "AUTO SQUARE OFF"],
    },
    product: {
      type: String,
      enum: ["CNC", "MIS"],
      default: "CNC",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const OrdersModel = mongoose.model("Order", OrdersSchema);

export default OrdersModel;
