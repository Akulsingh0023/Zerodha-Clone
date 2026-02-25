import React, { useEffect, useState } from "react";
import "../index.css";

const GlobalToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (e) => {
      const msg = e?.detail?.message || "";
      setMessage(msg);
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
      <div className="global-toast" role="status" aria-live="polite">
        {message}
      </div>
    )
  );
};

export default GlobalToast;
