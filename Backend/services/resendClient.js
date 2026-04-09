import { Resend } from "resend";

export const getResendClient = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;

  try {
    return new Resend(key);
  } catch (err) {
    console.warn("[Resend] Disabled:", err?.message || err);
    return null;
  }
};
