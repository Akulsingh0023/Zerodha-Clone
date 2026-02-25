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

    window.addEventListener("walletUpdated", onWalletUpdate);
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
          </div>
        </div>

        <div className="actions">
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

      <div className="transactions">
        <h4>Transaction History</h4>
        {txLoading ? (
          <Spinner />
        ) : transactions.length === 0 ? (
          <div className="empty">No Transactions Yet</div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className={t.type === "credit" ? "credit" : "debit"}>
                  <td>{new Date(t.createdAt || t.createdAt).toLocaleString()}</td>
                  <td>{t.type}</td>
                  <td>{formatCurrency(t.amount)}</td>
                  <td>{t.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />
    </div>
  );
};

export default Wallet;
