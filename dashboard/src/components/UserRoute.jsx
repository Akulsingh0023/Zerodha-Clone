import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const UserRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/me", {
        withCredentials: true,
      })
      .then((res) => {
        setRole(res.data?.role || null);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Checking access...</h2>;

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserRoute;
