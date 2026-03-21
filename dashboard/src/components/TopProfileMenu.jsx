import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API, { SITE_URL } from "../config";

const BASE_URL = API;

const TopProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/profile`, { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = `${SITE_URL}/login`;
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = SITE_URL;
  };

  return (
    <div className="zd-top-profile" ref={dropdownRef}>
      <button
        type="button"
        className="zd-top-avatar"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
      </button>

      {open && (
        <div className="zd-top-dropdown">
          <Link to="/profile" className="zd-top-item" onClick={() => setOpen(false)}>
            My Profile
          </Link>
          <Link to="/profile?tab=settings" className="zd-top-item" onClick={() => setOpen(false)}>
            Settings
          </Link>
          <button type="button" className="zd-top-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default TopProfileMenu;
