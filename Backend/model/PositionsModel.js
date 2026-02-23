import mongoose from "mongoose";

const PositionsSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
});

const PositionsModel = mongoose.model("Position", PositionsSchema);

export default PositionsModel;
