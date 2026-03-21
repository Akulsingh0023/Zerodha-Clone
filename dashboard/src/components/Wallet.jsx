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
  const [isPaying, setIsPaying] = useState(false);
  const [userId, setUserId] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const MAX_ADD_AMOUNT = Number(import.meta.env.VITE_WALLET_MAX_ADD_AMOUNT) || 100000;

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
    console.log("Razorpay key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
    fetchBalance();
    fetchTransactions();

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`);
        if (res.data?._id) setUserId(res.data._id);
        if (res.data?.id) setUserId(res.data.id);
      } catch {
        // Non-blocking: userId is optional for verification
      }
    };

    fetchUser();

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

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleAdd = async () => {
    const amountNum = Number(addAmount);
    if (!amountNum || amountNum <= 0) return showToast("Enter a valid amount", "error");
    if (amountNum > MAX_ADD_AMOUNT) return showToast(`Max add amount is ₹${MAX_ADD_AMOUNT.toLocaleString("en-IN")}`, "error");
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("Razorpay key:", key);
    if (!key) {
      console.error("Razorpay key is missing");
      return showToast("Razorpay key is missing", "error");
    }

    setIsPaying(true);
    try {
      const orderRes = await axios.post(`${BASE_URL}/api/payment/order`, { amount: amountNum });
      const order = orderRes.data;

      const sdkLoaded = await loadRazorpayScript();
      console.log("Razorpay object:", window.Razorpay);
      if (!sdkLoaded || !window.Razorpay) {
        window.alert("Razorpay SDK failed to load");
        showToast("Razorpay SDK not loaded", "error");
        setIsPaying(false);
        return;
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Akul Singh",
        description: "Add Money to Wallet",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${BASE_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId || undefined,
              amount: amountNum,
            });

            if (verifyRes.data?.success) {
              window.alert("Payment Successful ✅");
              showToast("Payment Successful ✅", "success");
              setBalance(verifyRes.data.balance ?? balance);
              setAddAmount("");
              fetchTransactions();
              window.dispatchEvent(new Event("walletUpdated"));
            } else {
              window.alert("Payment Failed ❌");
              showToast("Payment Failed ❌", "error");
            }
          } catch (err) {
            window.alert("Payment Failed ❌");
            showToast(err.response?.data?.message || "Payment verification failed", "error");
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            showToast("Payment cancelled", "error");
          },
        },
        theme: { color: "#0ea5e9" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      showToast(err.response?.data?.message || "Payment initiation failed", "error");
      setIsPaying(false);
    } finally {
      // Keep balance loader separate from payment flow
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
                <button className="action-btn" onClick={handleAdd} disabled={loading || isPaying}>
                  {isPaying ? "Processing..." : "Add"}
                </button>
              </div>

              <div className="action-card withdraw">
                <label>Withdraw</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount"
                />
                <button className="action-btn" onClick={handleWithdraw} disabled={loading || isPaying}>Withdraw</button>
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
