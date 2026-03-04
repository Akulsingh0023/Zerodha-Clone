import SupportTicket from "../model/SupportTicket.js";
import nodemailer from "nodemailer";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getAdminEmail = () =>
  process.env.ADMIN_EMAIL || process.env.SUPPORT_INBOX || process.env.EMAIL_USER;

const buildUserConfirmationEmailHtml = ({ name, subject, message, ticketId }) => {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return `
  <div style="margin:0;padding:0;background:#f4f7ff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;border-collapse:collapse;">
            <tr>
              <td style="border-radius:16px 16px 0 0;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#6366f1,#2563eb);background-color:#2563eb;padding:22px 22px;">
                  <div style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:0.2px;">Zerodha Clone • Support</div>
                  <div style="color:rgba(255,255,255,0.92);font-size:13px;margin-top:6px;">We’ve received your support request</div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="background:#ffffff;border-radius:0 0 16px 16px;box-shadow:0 18px 40px rgba(2,6,23,0.12);padding:22px;">
                <div style="font-size:15px;color:#0f172a;line-height:1.5;">
                  <p style="margin:0 0 10px;">Hi <b>${safeName || "there"}</b>,</p>
                  <p style="margin:0 0 14px;">Thanks for reaching out. Our support team has received your request and will get back to you shortly.</p>
                  <p style="margin:0 0 18px;color:#334155;">
                    <b>Ticket ID:</b> <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${escapeHtml(ticketId)}</span>
                  </p>
                </div>

                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;">
                  <div style="font-size:12px;font-weight:700;color:#475569;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:10px;">Message Summary</div>
                  <div style="font-size:14px;color:#0f172a;line-height:1.55;">
                    <div style="margin-bottom:10px;"><b>Subject:</b> ${safeSubject}</div>
                    <div><b>Message:</b></div>
                    <div style="margin-top:6px;white-space:pre-wrap;color:#0f172a;">${safeMessage}</div>
                  </div>
                </div>

                <div style="margin-top:18px;font-size:13px;color:#64748b;line-height:1.6;">
                  Our support team will get back to you shortly.
                </div>

                <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:13px;color:#475569;line-height:1.6;">
                  <div style="margin:0;">Best regards,</div>
                  <div style="margin:0;font-weight:700;color:#0f172a;">Zerodha Team</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
};

const buildAdminNotificationEmailHtml = ({ name, email, subject, message, ticketId }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return `
  <div style="margin:0;padding:0;background:#f4f7ff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="740" cellspacing="0" cellpadding="0" style="max-width:740px;width:100%;border-collapse:collapse;">
            <tr>
              <td style="border-radius:16px 16px 0 0;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#6366f1,#2563eb);background-color:#2563eb;padding:22px 22px;">
                  <div style="color:#ffffff;font-size:16px;font-weight:800;letter-spacing:0.2px;">New Customer Support Request</div>
                  <div style="color:rgba(255,255,255,0.92);font-size:13px;margin-top:6px;">Zerodha Clone • Support Inbox</div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="background:#ffffff;border-radius:0 0 16px 16px;box-shadow:0 18px 40px rgba(2,6,23,0.12);padding:22px;">
                <div style="font-size:13px;color:#334155;margin-bottom:14px;">
                  <b>Ticket ID:</b> <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${escapeHtml(ticketId)}</span>
                </div>

                <div style="background:#0f172a;border-radius:14px;padding:16px 16px;color:#f1f5f9;">
                  <div style="font-size:12px;font-weight:700;color:#cbd5e1;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:10px;">Contact Details</div>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:6px 0;color:#cbd5e1;width:120px;"><b>Name</b></td>
                      <td style="padding:6px 0;color:#ffffff;">${safeName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#cbd5e1;"><b>Email</b></td>
                      <td style="padding:6px 0;color:#ffffff;">${safeEmail}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#cbd5e1;"><b>Subject</b></td>
                      <td style="padding:6px 0;color:#ffffff;">${safeSubject}</td>
                    </tr>
                  </table>
                </div>

                <div style="margin-top:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;">
                  <div style="font-size:12px;font-weight:700;color:#475569;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:10px;">Message</div>
                  <div style="white-space:pre-wrap;font-size:14px;color:#0f172a;line-height:1.6;">${safeMessage}</div>
                </div>

                <div style="margin-top:18px;font-size:12px;color:#94a3b8;line-height:1.6;">
                  <div>This message was sent from Customer Support Form.</div>
                  <div>
                    Reply directly to:
                    <a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;">${safeEmail}</a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
};

export const createSupportTicket = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    const trimmedName = String(name || "").trim();
    const trimmedEmail = String(email || "").trim().toLowerCase();
    const trimmedSubject = String(subject || "").trim();
    const trimmedMessage = String(message || "").trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailOk) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (trimmedMessage.length < 10) {
      return res.status(400).json({ message: "Message must be at least 10 characters" });
    }

    const ticket = await SupportTicket.create({
      user: req.user._id,
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      status: "open",
    });

    // Email notifications (optional but recommended)
    const adminEmail = getAdminEmail();
    const emailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS && adminEmail);

    let confirmationToUserSent = false;
    let notificationToAdminSent = false;

    if (emailConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const from = `Zerodha Clone Support <${process.env.EMAIL_USER}>`;

        // EMAIL 1: Confirmation to customer
        await transporter.sendMail({
          from,
          to: trimmedEmail,
          subject: "We’ve Received Your Support Request – Zerodha Clone",
          html: buildUserConfirmationEmailHtml({
            name: trimmedName,
            subject: trimmedSubject,
            message: trimmedMessage,
            ticketId: ticket._id,
          }),
        });
        confirmationToUserSent = true;

        // EMAIL 2: Notification to admin
        await transporter.sendMail({
          from,
          to: adminEmail,
          replyTo: trimmedEmail,
          subject: "New Customer Support Request",
          html: buildAdminNotificationEmailHtml({
            name: trimmedName,
            email: trimmedEmail,
            subject: trimmedSubject,
            message: trimmedMessage,
            ticketId: ticket._id,
          }),
        });
        notificationToAdminSent = true;
      } catch (error) {
        // Don't fail the whole request if email fails; ticket is already saved.
        console.error("Support ticket email failed:", error?.message || error);
        confirmationToUserSent = false;
        notificationToAdminSent = false;
      }
    }

    return res.status(201).json({
      message: "Support ticket created",
      ticketId: ticket._id,
      email: {
        configured: emailConfigured,
        adminEmail: emailConfigured ? adminEmail : undefined,
        confirmationToUserSent,
        notificationToAdminSent,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
