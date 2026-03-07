import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    name: String,
    qty: Number,
    price: Number,
    mode: {
      type: String,
      enum: ["BUY", "SELL"],
    },
    product: {
      type: String,
      enum: ["CNC", "MIS"],
      default: "CNC",
    },
  },
  { timestamps: true }
);

const OrdersModel = mongoose.model("Order", OrdersSchema);

export default OrdersModel;
