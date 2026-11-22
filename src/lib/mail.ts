import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "prithvijitbasak22695@gmail.com",
    pass: (process.env.GOOGLE_APP_PASSWORD || "").replace(/\s+/g, ""),
  },
});

export async function sendOtpEmail(toEmail: string, otp: string, purpose: string) {
  const subject =
    purpose === "register"
      ? "CareWallet - Your Registration Verification Code"
      : "CareWallet - Your Login Verification Code";

  const actionText =
    purpose === "register"
      ? "complete your registration"
      : "log in to your CareWallet account";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4caf50; margin-top: 0;">CareWallet</h2>
      <p style="font-size: 16px; color: #333333;">Hello,</p>
      <p style="font-size: 15px; color: #555555;">Use the following 6-digit verification code to ${actionText}:</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2e7d32; background-color: #e8f5e9; padding: 12px 24px; border-radius: 8px; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 13px; color: #888888; margin-bottom: 0;">
        This code is valid for 5 minutes. If you did not request this code, please ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"CareWallet" <${process.env.EMAIL_USER || "prithvijitbasak22695@gmail.com"}>`,
    to: toEmail,
    subject: subject,
    html: html,
  });
}
