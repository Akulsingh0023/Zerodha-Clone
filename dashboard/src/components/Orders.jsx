import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import "./Orders.css";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatTime = (d) =>
  new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

const Orders = () => {
  const [purchasedOrders, setPurchasedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(() => {
    axios
      .get(`${BASE_URL}/newOrder`)
      .then((res) => {
        setPurchasedOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
    const onTrade = () => fetchOrders();
    window.addEventListener("walletUpdated", onTrade);
    return () => window.removeEventListener("walletUpdated", onTrade);
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="orders">
        <div className="ord-loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders">
      <h3 className="title">Orders ({purchasedOrders.length})</h3>

      {purchasedOrders.length > 0 ? (
        <div className="order-table">
          <table className="ord-table">
            <thead>
              <tr>
                <th className="align-left">SYMBOL</th>
                <th>ACTION</th>
                <th>ORDER TYPE</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>DATE</th>
                <th>TIME</th>
              </tr>
            </thead>
            <tbody>
              {purchasedOrders.map((order, i) => {
                const isBuy = order.mode === "BUY";
                const orderType = order.product || "CNC";

                return (
                  <tr key={order._id || i}>
                    <td className="align-left ord-symbol">{order.name}</td>
                    <td>
                      <span className={`ord-badge ${isBuy ? "buy" : "sell"}`}>
                        {order.mode}
                      </span>
                    </td>
                    <td>
                      <span className={`ord-badge ${orderType === "MIS" ? "mis" : "cnc"}`}>
                        {orderType}
                      </span>
                    </td>
                    <td>{order.qty}</td>
                    <td>₹{Number(order.price).toFixed(2)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatTime(order.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
