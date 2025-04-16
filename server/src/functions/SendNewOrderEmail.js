import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { EMAIL_PASS, EMAIL_USER, FRONTEND_URL, TOKEN_SECRET } from '../config.js';

export const sendNewOrderEmail = async (order, clientEmail) => {
  const { order_details, status, date_time, type, id, total_price, code } = order;

  // Generar un token seguro que incluya el ID de la orden (válido por 1 hora)
  const tokenForOrder = jwt.sign({ orderId: id }, TOKEN_SECRET, { expiresIn: '1h' });

  // Construir la tabla de ítems en HTML
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
          ${
            item.selectedExtras
              ? `
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; background-color: #fafafa;">
                  <strong>Extras:</strong>
                  <ul style="margin: 5px 0 0 20px; padding: 0;">
                    ${
                      Object.keys(item.selectedExtras).map(extraKey => {
                        const extraItem = item.selectedExtras[extraKey];
                        const extraName = extraItem?.name || 'Extra';
                        const extraPrice = Number(extraItem?.price ?? 0).toFixed(2);
                        return `
                          <li style="margin: 0;">
                            ${extraName}: $${extraPrice}
                          </li>
                        `;
                      }).join('')
                    }
                  </ul>
                </td>
              </tr>
              `
              : ''
          }
        `).join('')}
      </tbody>
    </table>
  `;

  // Construir la URL segura para aceptar el pedido usando BACK_URL y el token generado
  const acceptOrderURL = `${FRONTEND_URL}/order-accepted?orderId=${id}&token=${tokenForOrder}`;


  // Sección de información del pedido
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
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Order ID:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${id}</td>
        </tr>
      </table>
    </div>
  `;

  // Estructura principal del correo HTML
  const contentHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>New Order Notification</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f7f7f7;
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
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        background-color: #ffffff;
      }
      .header {
        background-color: #f2a900;
        color: #fff;
        padding: 25px;
        text-align: center;
      }
      .header h2 {
        margin: 0;
        font-size: 26px;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 25px;
      }
      .content h3 {
        color: #f2a900;
        margin-top: 0;
        font-size: 22px;
      }
      .content p {
        line-height: 1.6;
        margin: 10px 0;
        font-size: 16px;
      }
      .btn {
        display: block;
        width: fit-content;
        margin: 25px auto;
        padding: 14px 24px;
        background-color: #28a745;
        color: #fff !important;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: background-color 0.3s;
      }
      .btn:hover {
        background-color: #218838;
      }
      .footer {
        background-color: #f9f9f9;
        color: #777;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        border-top: 1px solid #eee;
      }
      .total {
        margin-top: 25px;
        font-size: 22px;
        font-weight: bold;
        text-align: right;
        color: #333;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      .pickup-code {
        margin: 25px auto;
        padding: 20px;
        background-color: #f2a900;
        color: #fff;
        text-align: center;
        border-radius: 8px;
        max-width: 300px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .pickup-code h3 {
        margin: 0 0 10px 0;
        color: #fff;
        font-size: 18px;
      }
      .pickup-code .code {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 2px;
        margin: 0;
      }
      .pickup-code .instructions {
        font-size: 14px;
        margin-top: 10px;
        opacity: 0.9;
      }
      table {
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      th {
        font-size: 15px;
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
        
        <!-- Pickup Code Section -->
        <div class="pickup-code">
          <h3>ORDER CODE</h3>
          <p class="code">${code || 'N/A'}</p>
          <p class="instructions">The user must show this code to receive their order</p>
        </div>
        
        ${itemsHTML}
        ${orderInfoHTML}
        <p class="total">Total Price: $${total_price}</p>
        <a href="${acceptOrderURL}" class="btn">Accept Order</a>
      </div>
      <div class="footer">
        <p>Thank you for using Bodega+</p>
        <p><strong>Bodega+</strong> | Your Neighborhood Store</p>
      </div>
    </div>
  </body>
  </html>
  `;

  // Configura el transporter de Nodemailer (usando Gmail)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER, // Tu correo Gmail
      pass: EMAIL_PASS  // Contraseña o app password
    }
  });

  // Envía el correo
  try {
    let info = await transporter.sendMail({
      from: `"Bodega+" <${EMAIL_USER}>`,
      to: clientEmail,
      subject: 'New Order Notification',
      html: contentHTML
    });


    return { success: true, message: 'Order notification email sent successfully' };
  } catch (error) {
    console.error("Error sending order notification email:", error);
    return { success: false, message: 'Error sending order notification email' };
  }
};
