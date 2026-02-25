import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import "./BuyActionWindow.css";
import { showGlobalToast } from "../utils/toast";

const BuyActionWindow = ({ stock, closeBuyWindow }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const stockPrice = stock.price; // Auto-filled from selected stock

  // Convert quantity to number for calculation
  const qty = Number(stockQuantity) || 0;
  
  // Calculate total amount
  const totalAmount = (stockPrice * qty).toFixed(2);
  const marginRequired = totalAmount; // For delivery, margin = total amount

  const handleBuyClick = () => {
    (async () => {
      try {
        // check wallet balance first
        const qtyNum = Number(stockQuantity) || 0;
        const totalCost = qtyNum * Number(stockPrice || 0);
        const balRes = await axios.get(`${BASE_URL}/wallet/balance`);
        const balance = balRes.data?.balance ?? balRes.data?.walletBalance ?? 0;

        if (balance < totalCost) {
          showGlobalToast("Insufficient balance in wallet");
          return; // prevent buy
        }

        const res = await axios.post(`${BASE_URL}/newOrder`, {
          name: stock.name,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: "BUY",
        });

        if (res.data?.success) {
          // notify other parts of app to refresh wallet/holdings
          window.dispatchEvent(new Event("walletUpdated"));
          // close only on success
          closeBuyWindow();
        }
      } catch (err) {
        console.error(err);
        showGlobalToast(err.response?.data?.message || "Buy failed");
        closeBuyWindow();
      }
    })();
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="stock-info">
          <h4>{stock.name}</h4>
          <p>Price: ₹{stockPrice.toFixed(2)}</p>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>

          <fieldset>
            <legend>Total (₹)</legend>
            <input
              type="text"
              name="total"
              id="total"
              readOnly
              value={totalAmount}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{marginRequired}</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;