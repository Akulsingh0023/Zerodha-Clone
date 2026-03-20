import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import API from "../config";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/me`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.role === "admin") {
          setIsAdmin(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Checking admin access...</h2>;

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;