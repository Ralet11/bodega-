
import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from '../config.js';

export const sendVerificationCodeEmail = async (email, verificationCode) => {
  const contentHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Verification Code</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 0; margin: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .header { background-color: #FFD700; color: #000; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h2 { margin: 0; }
        .content { padding: 20px; }
        .content p { margin: 10px 0; font-size: 16px; }
        .code { font-size: 24px; font-weight: bold; color: #FFD700; text-align: center; margin: 20px 0; }
        .footer { margin-top: 20px; text-align: center; color: #777; padding: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Reset</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You requested a password reset. Please use the following verification code:</p>
          <div class="code">${verificationCode}</div>
          <p>This code will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>Bodega Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });

  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      html: contentHTML
    });

    console.log('Verification email sent: %s', info.messageId);
    return { success: true, message: 'Verification code sent successfully.' };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return { success: false, message: 'Failed to send verification code.' };
  }
};