import { useEffect, useState } from "react";
import axios from "axios";
import API, { SITE_URL } from "../config";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API}/api/auth/profile`, {
          withCredentials: true,
        });

        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    window.location.href = SITE_URL;
    return null;
  }

  return children;
};

export default ProtectedRoute;