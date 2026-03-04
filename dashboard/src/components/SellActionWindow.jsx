import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import "./SellActionWindow.css";

const SellActionWindow = ({ stock, closeSellWindow }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [holdingQuantity, setHoldingQuantity] = useState(() => Number(stock?.qty) || 0);
  const [error, setError] = useState("");

  const stockPrice = stock.price; // Auto-filled from selected stock
  const product = stock?.product || "CNC";

  // For MIS positions, default to closing the full position.
  useEffect(() => {
    if (product === "MIS" && typeof stock?.qty === "number" && stock.qty > 0) {
      setStockQuantity(stock.qty);
    }
  }, [product, stock?.qty]);

  // Fetch holding quantity
  useEffect(() => {
    const fetchHoldingQuantity = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/allHoldings`);
        const holding = res.data.find((h) => h.name === stock.name);
        if (holding) {
          setHoldingQuantity(holding.qty);
        }
      } catch (err) {
        console.error("Error fetching holding quantity:", err);
      }
    };

    // If caller already passed holding qty (e.g. Holdings page), use it.
    if (typeof stock?.qty === "number" && stock.qty >= 0) {
      setHoldingQuantity(stock.qty);
      return;
    }

    fetchHoldingQuantity();
  }, [stock.name, stock?.qty]);

  // Convert quantity to number for calculation
  const qty = Number(stockQuantity) || 0;

  // Calculate sell value, charges, and net amount
  const sellValueNum = stockPrice * qty;
  const sellValue = sellValueNum.toFixed(2);
  const charges = (Math.max(sellValueNum * 0.001, 20)).toFixed(2);
  const youReceive = (sellValueNum - parseFloat(charges)).toFixed(2);

  // Validation
  const isInvalidQuantity = qty <= 0;
  const isInsufficientShares = qty > holdingQuantity;

  const handleSellClick = () => {
    // Validate
    if (isInvalidQuantity) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (isInsufficientShares) {
      setError(
        `You only have ${holdingQuantity} shares. Cannot sell ${qty}.`
      );
      return;
    }

    // Place order
    (async () => {
      try {
        const res = await axios.post(`${BASE_URL}/newOrder`, {
          name: stock.name,
          qty: qty,
          price: Number(stockPrice),
          mode: "SELL",
          product,
        });

        if (res.data?.success) {
          window.dispatchEvent(new Event("walletUpdated"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        closeSellWindow();
      }
    })();
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="stock-info">
          <h4>Sell {stock.name}</h4>
          <p>Price: ₹{stockPrice.toFixed(2)}</p>
          <p className="holding-qty">Available: {holdingQuantity} shares</p>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              value={stockQuantity}
              onChange={(e) => {
                setStockQuantity(e.target.value);
                setError(""); // Clear error on input change
              }}
            />
          </fieldset>

          <fieldset>
            <legend>Sell Value (₹)</legend>
            <input
              type="text"
              name="sellValue"
              id="sellValue"
              readOnly
              value={sellValue}
            />
          </fieldset>
        </div>

        {/* Charges & Net Amount */}
        <div className="sell-breakdown">
          <div className="breakdown-row">
            <span className="label">Sell Value:</span>
            <span className="value">₹{sellValue}</span>
          </div>
          <div className="breakdown-row">
            <span className="label">Estimated Charges:</span>
            <span className="value">-₹{charges}</span>
          </div>
          <div className="breakdown-row highlight">
            <span className="label">You Receive:</span>
            <span className="value">₹{youReceive}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="buttons">
        <div>
          <Link
            className={`btn btn-red ${
              isInvalidQuantity || isInsufficientShares ? "disabled" : ""
            }`}
            onClick={handleSellClick}
          >
            Sell
          </Link>
          <Link className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;