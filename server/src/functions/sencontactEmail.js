import nodemailer from 'nodemailer';

import { EMAIL_PASS, EMAIL_USER } from '../config.js';


export const sendContactEmail = async (name, email, phone, message) => {

  
   
    const contentHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Inquiry</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Contact Inquiry</h2>
        </div>
        <div class="content">
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <h3>Message</h3>
          <p>${message}</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>Bodega Team</p>
        </div>
      </div>
    </body>
    </html>
    `;
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,  // Replace with your Gmail address from environment variables
        pass: EMAIL_PASS   // Replace with your Gmail password or app-specific password from environment variables
      }
    });
  
    try {
      let info = await transporter.sendMail({
        from: EMAIL_USER,  // Replace with your Gmail address
        to: EMAIL_USER,    // Replace with the actual recipient
        subject: 'Contact Inquiry',
        html: contentHTML
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, message: 'Error sending email' };
    }
  };