import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from '../config.js';

export const sendWelcomeEmail = async (name, email) => {
  
  const contentHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Bodega+</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        line-height: 1.6;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
      }
      .header {
        background-color: #FFD700;
        color: #000;
        padding: 10px;
        border-radius: 8px 8px 0 0;
        text-align: center;
      }
      .header h2 {
        margin: 0;
      }
      .content {
        padding: 20px;
      }
      .content h3 {
        color: #000;
        margin-top: 20px;
      }
      .content p {
        margin: 10px 0;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #777;
        padding: 10px;
        color: #000;
        border-radius: 0 0 8px 8px;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #FFD700;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Welcome to Bodega+</h2>
      </div>
      <div class="content">
        <h3>Hello, ${name}!</h3>
        <p>We're thrilled to have you with us. Bodega+ is here to help you manage your store with ease and efficiency.</p>
        <p>You can now start exploring all the features we have to offer. If you have any questions or need any help, don't hesitate to reach out to our support team.</p>
       
      </div>
      <div class="footer">
        <p>Best regards,</p>
        <p>The Bodega+ Team</p>
        <p><a href="https://bodegastore.net">Visit our website</a></p>
      </div>
    </div>
  </body>
  </html>
  `;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,  // Reemplaza con tu dirección de Gmail
      pass: EMAIL_PASS   // Reemplaza con tu contraseña de Gmail o contraseña de aplicación
    }
  });

  try {
    let info = await transporter.sendMail({
      from: `"Bodega+" <${EMAIL_USER}>`,  // Reemplaza con tu dirección de Gmail
      to: email,    // Reemplaza con el correo electrónico del usuario
      subject: 'Welcome to Bodega+',
      html: contentHTML
    });

    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, message: 'Error sending welcome email' };
  }
};