import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import "./WatchList.css";

const WatchlistItem = ({ stock, priceData, onRemove }) => {
  const [showActions, setShowActions] = useState(false);
  const { openBuyWindow } = useContext(GeneralContext);

  const ltp = priceData?.ltp ?? null;
  const change = priceData?.change ?? 0;
  const changePercent = priceData?.changePercent ?? 0;
  const isUp = change >= 0;
  const priceLoaded = ltp !== null;

  const handleBuy = () => {
    openBuyWindow({
      name: stock.symbol,
      price: ltp || 0,
    });
  };

  return (
    <li
      className="wl-item-row"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="wl-item-content">
        <div className="wl-item-left">
          <span className="wl-item-symbol">{stock.symbol}</span>
          {stock.name && stock.name !== stock.symbol && (
            <span className="wl-item-name">{stock.name}</span>
          )}
        </div>

        <div className="wl-item-right">
          {priceLoaded ? (
            <>
              <span className={`wl-item-change ${isUp ? "wl-green" : "wl-red"}`}>
                {isUp ? "▲" : "▼"} ₹{Math.abs(change).toFixed(2)}
              </span>
              <span className={`wl-item-percent ${isUp ? "wl-green" : "wl-red"}`}>
                ({isUp ? "+" : ""}{changePercent.toFixed(2)}%)
              </span>
              <span className={`wl-item-ltp ${isUp ? "wl-green" : "wl-red"}`}>
                ₹{ltp.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="wl-item-loading">Loading...</span>
          )}
        </div>
      </div>

      {/* Action buttons on hover */}
      {showActions && (
        <div className="wl-item-actions">
          <button className="wl-btn-buy" onClick={handleBuy} title="Buy">
            B
          </button>
          <button
            className="wl-btn-remove"
            onClick={() => onRemove(stock.symbol)}
            title="Remove"
          >
            ✕
          </button>
        </div>
      )}
    </li>
  );
};

export default WatchlistItem;
