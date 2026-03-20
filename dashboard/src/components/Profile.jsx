import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import API from "../config";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API}/api/me`,
          { withCredentials: true }
        );

        if (res.data) {
          setFormData({
            name: res.data.name || "",
            email: res.data.email || ""
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");

    try {
      await axios.put(
        `${API}/api/me`,
        { name: formData.name },
        { withCredentials: true }
      );

      setMessage("Profile updated successfully");

      // 🔥 Auto close after success
      setTimeout(() => {
        navigate(-1);
      }, 1200);

    } catch (error) {
      console.error("Update error:", error);
      setMessage("Update failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return null;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        <button
          className="close-btn"
          onClick={() => navigate(-1)}
        >
          ×
        </button>

        <h2>Update Profile Details</h2>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={updating}
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
          />

          <button
            type="submit"
            className="save-btn"
            disabled={updating}
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;