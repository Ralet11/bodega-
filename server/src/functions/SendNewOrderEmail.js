import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from '../config.js';

export const sendNewOrderEmail = async (order, clientEmail) => {

  const { order_details, status, date_time, type, id, total_price } = order;

  // Build the HTML content for the items in a table format
  const itemsHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2a900; color: #fff;">Product</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2a900; color: #fff;">Description</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2a900; color: #fff;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2a900; color: #fff;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order_details.map(item => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$${item.price}</td>
          </tr>
          ${item.selectedExtras ? `
          <tr>
            <td colspan="4" style="border: 1px solid #ddd; padding: 8px; background-color: #fafafa;">
              <strong>Extras:</strong>
              <ul style="margin: 5px 0 0 20px; padding: 0;">
                ${Object.keys(item.selectedExtras).map(extraKey => `
                  <li style="margin: 0;">${item.selectedExtras[extraKey].name}: $${item.selectedExtras[extraKey].price.toFixed(2)}</li>
                `).join('')}
              </ul>
            </td>
          </tr>` : ''}
        `).join('')}
      </tbody>
    </table>
  `;

  // URL of your backend to accept the order
  const acceptOrderURL = `http://3.15.211.38/api/orders/acceptByEmail/${id}`; // Replace with your API URL

  // Section for order information
  const orderInfoHTML = `
    <div style="margin-top: 20px;">
      <h4 style="margin-bottom: 10px; color: #f2a900;">Order Information</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Status:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${status}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Date and Time:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date(date_time).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Order Type:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${type}</td>
        </tr>
      </table>
    </div>
  `;

  const contentHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>New Order Notification</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #f2a900;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
      .header h2 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
      }
      .content h3 {
        color: #f2a900;
        margin-top: 0;
      }
      .content p {
        line-height: 1.6;
        margin: 10px 0;
      }
      .btn {
        display: block;
        width: fit-content;
        margin: 20px auto;
        padding: 12px 20px;
        background-color: #28a745;
        color: #fff !important;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
        font-size: 16px;
      }
      .footer {
        background-color: #f9f9f9;
        color: #777;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      .total {
        margin-top: 20px;
        font-size: 20px;
        font-weight: bold;
        text-align: right;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>New Order Received!</h2>
      </div>
      <div class="content">
        <h3>Hello,</h3>
        <p>You have received a new order. Here are the details:</p>
        ${itemsHTML}
        ${orderInfoHTML}
        <p class="total">Total Price: $${total_price}</p>
        <a href="${acceptOrderURL}" class="btn">Accept Order</a>
      </div>
      <div class="footer">
        <p>Thank you for using Bodega+</p>
        <p><strong>Bodega+</strong></p>
      </div>
    </div>
  </body>
  </html>
  `;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,  // Replace with your Gmail address
      pass: EMAIL_PASS   // Replace with your Gmail password or app password
    }
  });

  try {
    let info = await transporter.sendMail({
      from: `"Bodega+" <${EMAIL_USER}>`,  // Replace with your Gmail address
      to: clientEmail,    // Replace with the store owner's email address
      subject: 'New Order Notification',
      html: contentHTML
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return { success: true, message: 'Order notification email sent successfully' };
  } catch (error) {
    console.error("Error sending order notification email:", error);
    return { success: false, message: 'Error sending order notification email' };
  }
};
