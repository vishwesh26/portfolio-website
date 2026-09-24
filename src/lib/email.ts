import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  name: string;
  contact: string;
  reason: string;
  message: string;
}

/**
 * Creates and caches the nodemailer transporter using environment credentials.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || "accf40075@gmail.com";
  // Strip whitespace from Gmail app passwords
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 or 25
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends portfolio contact form details to Vishwesh's email via SMTP.
 */
export async function sendContactEmail(payload: ContactEmailPayload) {
  const { name, contact, reason, message } = payload;
  const recipient = process.env.SMTP_USER || "accf40075@gmail.com";
  const transporter = getTransporter();

  // If the contact field looks like an email, configure it as reply-to
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());
  const replyTo = isEmail ? contact.trim() : undefined;

  const now = new Date();
  const dateFormatted = now.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const subject = `📬 Portfolio Message from ${name} [${reason}]`;

  const textBody = `
New message received from your portfolio contact form!

----------------------------------------
SENDER DETAILS
----------------------------------------
Name:    ${name}
Contact: ${contact}
Reason:  ${reason}
Time:    ${dateFormatted} (IST)

----------------------------------------
MESSAGE
----------------------------------------
${message}

----------------------------------------
Reply directly to this email if an email address was provided above.
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 1px solid #e4e4e7;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 32px; color: #ffffff;">
              <span style="display: inline-block; background-color: rgba(255, 106, 61, 0.18); color: #ff6a3d; border: 1px solid rgba(255, 106, 61, 0.35); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 9999px;">
                Portfolio Contact Form
              </span>
              <h1 style="margin: 12px 0 4px 0; font-size: 22px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                New message from ${escapeHtml(name)}
              </h1>
              <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                Received on ${dateFormatted} (IST)
              </p>
            </td>
          </tr>

          <!-- Content Details -->
          <tr>
            <td style="padding: 28px 32px 16px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 13px; color: #71717a; width: 120px; font-weight: 600;">
                    Name
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; color: #18181b; font-weight: 600;">
                    ${escapeHtml(name)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 13px; color: #71717a; font-weight: 600;">
                    Contact Info
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; color: #18181b;">
                    ${isEmail ? `<a href="mailto:${escapeHtml(contact)}" style="color: #ff6a3d; text-decoration: none; font-weight: 600;">${escapeHtml(contact)}</a>` : escapeHtml(contact)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 13px; color: #71717a; font-weight: 600;">
                    Reason
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; color: #18181b;">
                    <span style="display: inline-block; background-color: #f4f4f5; border-radius: 6px; padding: 2px 8px; font-size: 12px; font-weight: 500;">
                      ${escapeHtml(reason)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 8px 32px 28px 32px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                Message:
              </p>
              <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-left: 4px solid #ff6a3d; border-radius: 8px; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </td>
          </tr>

          <!-- Action / Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px 32px; text-align: center;">
              ${
                isEmail
                  ? `<a href="mailto:${escapeHtml(contact)}?subject=${encodeURIComponent(`Re: ${reason} (Portfolio Inquiry)`)}" style="display: inline-block; background-color: #ff6a3d; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 22px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(255, 106, 61, 0.35);">Reply directly to ${escapeHtml(name)}</a>`
                  : `<span style="font-size: 12px; color: #71717a;">Sender provided phone / non-email contact: <strong>${escapeHtml(contact)}</strong></span>`
              }
            </td>
          </tr>

        </table>

        <!-- Small footer note -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin-top: 16px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #a1a1aa; line-height: 1.4;">
              Sent automatically from your portfolio website at Vishwesh Shinde's developer portfolio.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return await transporter.sendMail({
    from: `"Portfolio Contact" <${recipient}>`,
    to: recipient,
    replyTo,
    subject,
    text: textBody,
    html: htmlBody,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
