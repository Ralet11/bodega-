import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from '../config.js';

export const sendNewOrderEmail = async (order, clientEmail, originalDeliveryFee, tip, deliveryInstructions) => {

  console.log(tip, "tip");
  console.log(originalDeliveryFee, "original delivery");

  const { order_details, status, date_time, deliveryAddress, type, id, total_price } = order;

  // Convert originalDeliveryFee and tip to numbers if they are not
  const deliveryFee = parseFloat(originalDeliveryFee) || 0;
  const tipAmount = parseFloat(tip) || 0;

  // Build the HTML content for the items in a table format
  const itemsHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f8f8;">Product</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f8f8;">Description</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f8f8;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f8f8;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order_details.map(item => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">
              <img src="${item.image}" alt="${item.name}" style="max-width: 50px; vertical-align: middle;">
              ${item.name}
            </td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$${item.price}</td>
          </tr>
          ${item.selectedExtras ? `
          <tr>
            <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px;">
              <strong>Extras:</strong>
              <ul>
                ${Object.keys(item.selectedExtras).map(extraKey => `
                  <li>${item.selectedExtras[extraKey].name}: $${item.selectedExtras[extraKey].price.toFixed(2)}</li>
                `).join('')}
              </ul>
            </td>
          </tr>` : ''}
        `).join('')}
      </tbody>
    </table>
  `;

  // URL of your backend to accept the order
  const acceptOrderURL = `http://localhost:80/api/orders/acceptByEmail/${id}`; // Replace with your API URL

  // Section for delivery, tip, and instructions information
  const deliveryTipHTML = `
    <div style="margin-top: 20px;">
      <h4 style="margin-bottom: 10px;">Delivery & Tip Information</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Delivery Fee:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${deliveryFee.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tip Amount:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${tipAmount.toFixed(2)}</td>
        </tr>
        ${deliveryInstructions ? `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Delivery Instructions:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deliveryInstructions}</td>
        </tr>` : ''}
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f8f8f8;"><strong>Total Delivery & Tip:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f8f8f8;">$${(deliveryFee + tipAmount).toFixed(2)}</td>
        </tr>
      </table>
    </div>
  `;

  // Section for order information
  const orderInfoHTML = `
    <div style="margin-top: 20px;">
      <h4 style="margin-bottom: 10px;">Order Information</h4>
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
        ${deliveryAddress ? `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Delivery Address:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deliveryAddress}</td>
        </tr>` : ''}
      </table>
    </div>
  `;

  const contentHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
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
        background-color: #28a745;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .total {
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>New Order Notification</h2>
      </div>
      <div class="content">
        <h3>Hello!</h3>
        <p>You have received a new order. Here are the details:</p>
        ${itemsHTML}
        ${orderInfoHTML}
        ${deliveryTipHTML}
        <p class="total">Total Price: $${total_price}</p>
        <a href="${acceptOrderURL}" class="btn">Accept Order</a>
      </div>
      <div class="footer">
        <p>Best regards,</p>
        <p>The Bodega+ Team</p>
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