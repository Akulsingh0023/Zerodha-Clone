import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./Wallet.css";

const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v);

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`wallet-toast ${type}`} onClick={onClose}>
      {message}
    </div>
  );
};

const Spinner = () => (
  <div className="wallet-spinner" aria-hidden>
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
  </div>
);

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/wallet/balance`);
      if (res.data?.balance !== undefined) setBalance(res.data.balance);
    } catch (err) {
      showToast("Failed to fetch balance", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setTxLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/wallet/transactions`);
      setTransactions(res.data || []);
    } catch (err) {
      showToast("Failed to fetch transactions", "error");
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();

    const onWalletUpdate = () => {
      fetchBalance();
      fetchTransactions();
    };

    const onAppToast = (e) => {
      const detail = e.detail || {};
      if (detail.message) showToast(detail.message, detail.type || "error");
    };

    window.addEventListener("walletUpdated", onWalletUpdate);
    window.addEventListener("appToast", onAppToast);
    return () => window.removeEventListener("walletUpdated", onWalletUpdate);
  }, []);

  const handleAdd = async () => {
    if (!addAmount || Number(addAmount) <= 0) return showToast("Enter a valid amount", "error");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/wallet/add`, { amount: Number(addAmount) });
      if (res.data?.balance !== undefined) {
        setBalance(res.data.balance);
        fetchTransactions();
        showToast("Amount added successfully", "success");
        setAddAmount("");
        window.dispatchEvent(new Event("walletUpdated"));
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Add failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return showToast("Enter a valid amount", "error");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/wallet/withdraw`, { amount: Number(withdrawAmount) });
      if (res.data?.balance !== undefined) {
        setBalance(res.data.balance);
        fetchTransactions();
        showToast("Withdraw successful", "success");
        setWithdrawAmount("");
        window.dispatchEvent(new Event("walletUpdated"));
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Withdraw failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-page">
      <div className="wallet-top">
        <div className="balance-card">
          <div className="balance-left">
            <h4>Available Funds</h4>
            {loading ? <Spinner /> : <p className="balance-amount">{formatCurrency(balance)}</p>}
            <p className="balance-sub">Use these funds to buy stocks</p>

            <div className="inner-actions">
              <div className="action-card add">
                <label>Add Money</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Amount"
                />
                <button className="action-btn" onClick={handleAdd} disabled={loading}>Add</button>
              </div>

              <div className="action-card withdraw">
                <label>Withdraw</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount"
                />
                <button className="action-btn" onClick={handleWithdraw} disabled={loading}>Withdraw</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="transactions">
        <div className="tx-header">
          <h4>Transaction History</h4>
          <span className="tx-count">{transactions.length} transactions</span>
        </div>
        {txLoading ? (
          <div className="tx-loading"><Spinner /></div>
        ) : transactions.length === 0 ? (
          <div className="tx-empty">
            <span className="tx-empty-icon">📋</span>
            <p>No transactions yet</p>
            <span className="tx-empty-sub">Add or withdraw funds to see your history</span>
          </div>
        ) : (
          <div className="tx-scroll">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TYPE</th>
                  <th>AMOUNT</th>
                  <th>REASON</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const d = new Date(t.createdAt);
                  const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                  const isCredit = t.type === "credit";
                  return (
                    <tr key={t._id} className={isCredit ? "credit" : "debit"}>
                      <td>
                        <span className="tx-date">{date}</span>
                        <span className="tx-time">{time}</span>
                      </td>
                      <td>
                        <span className={`tx-badge ${isCredit ? "badge-credit" : "badge-debit"}`}>
                          {isCredit ? "↑ Credit" : "↓ Debit"}
                        </span>
                      </td>
                      <td className="tx-amount">
                        <span className={isCredit ? "amt-credit" : "amt-debit"}>
                          {isCredit ? "+" : "-"}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      <td className="tx-reason">{t.reason || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />
    </div>
  );
};

export default Wallet;
