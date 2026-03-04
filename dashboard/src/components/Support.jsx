import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { showGlobalToast } from "../utils/toast";
import "./Support.css";

const Support = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const prefill = async () => {
      try {
        const res = await axios.get("/api/me");
        const user = res.data;
        setForm((prev) => ({
          ...prev,
          name: prev.name || user?.name || user?.fullname || "",
          email: prev.email || user?.email || "",
        }));
      } catch {
        // ignore; route guards already handle auth
      }
    };

    prefill();
  }, []);

  const errors = useMemo(() => {
    const next = {};

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name) next.name = "Name is required";
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email";
    }
    if (!subject) next.subject = "Subject is required";
    if (!message) next.message = "Message is required";
    else if (message.length < 10) next.message = "Message must be at least 10 characters";

    return next;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid) {
      showGlobalToast("Please fix the highlighted fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post("/api/support", {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      const email = res?.data?.email;
      if (email?.configured === false) {
        showGlobalToast("Submitted. Email not configured on server.", "success");
      } else if (
        email?.configured === true &&
        (!email?.confirmationToUserSent || !email?.notificationToAdminSent)
      ) {
        showGlobalToast("Submitted. Email delivery failed.", "success");
      } else {
        showGlobalToast("Support request submitted", "success");
      }
      setForm((prev) => ({ ...prev, subject: "", message: "" }));
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to submit support request";
      showGlobalToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <h2>Customer Support</h2>
        <p>Submit your query and we’ll get back to you.</p>
      </div>

      <div className="support-card">
        <form onSubmit={handleSubmit} className="support-form">
          <div className="support-row">
            <div className="support-field">
              <label className="support-label" htmlFor="support-name">Name</label>
          <input
            id="support-name"
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => markTouched("name")}
            className="support-input"
            autoComplete="name"
            disabled={submitting}
          />
          {touched.name && errors.name && (
            <div className="support-error">{errors.name}</div>
          )}

            </div>

            <div className="support-field">
              <label className="support-label" htmlFor="support-email">Email</label>
          <input
            id="support-email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => markTouched("email")}
            className="support-input"
            autoComplete="email"
            disabled={submitting}
          />
          {touched.email && errors.email && (
            <div className="support-error">{errors.email}</div>
          )}

            </div>
          </div>

          <div className="support-field">
            <label className="support-label" htmlFor="support-subject">Subject</label>
          <input
            id="support-subject"
            type="text"
            value={form.subject}
            onChange={(e) => setField("subject", e.target.value)}
            onBlur={() => markTouched("subject")}
            className="support-input"
            disabled={submitting}
          />
          {touched.subject && errors.subject && (
            <div className="support-error">{errors.subject}</div>
          )}

          </div>

          <div className="support-field">
            <label className="support-label" htmlFor="support-message">Message</label>
          <textarea
            id="support-message"
            rows={5}
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            onBlur={() => markTouched("message")}
            className="support-textarea"
            disabled={submitting}
          />
          {touched.message && errors.message && (
            <div className="support-error">{errors.message}</div>
          )}

          </div>

          <div className="support-actions">
            <button
              type="submit"
              className="support-submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Support;
