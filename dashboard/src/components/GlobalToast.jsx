import React, { useEffect, useState } from "react";
import "../index.css";

const GlobalToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("error");

  useEffect(() => {
    const handler = (e) => {
      const msg = e?.detail?.message || "";
      const toastType = e?.detail?.type || "error";
      setMessage(msg);
      setType(toastType);
      // show
      setVisible(true);
      // auto hide after 2s
      setTimeout(() => setVisible(false), 2000);
    };

    window.addEventListener("showGlobalToast", handler);
    return () => window.removeEventListener("showGlobalToast", handler);
  }, []);

  return (
    visible && (
      <div className={`global-toast ${type}`} role="status" aria-live="polite">
        {message}
      </div>
    )
  );
};

export default GlobalToast;
