import nodemailer from 'nodemailer';

export const sendEmailWithProducts = async (orderData, clientData, localData, supplierData) => {
  // Construir el contenido del email
  let productsList = '';
  orderData.forEach(product => {
    productsList += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.id}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${product.id_proveedor}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${product.price}</td>
      </tr>
    `;
  });

  let supplierList='';

  supplierData.forEach(supplier =>{
    supplierList += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${supplier.id}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${supplier.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${supplier.email}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${supplier.phone}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${supplier.address}</td>
      </tr>`
    })

  const contentHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order</title>
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
      .content table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .content th, .content td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: left;
      }
      .content th {
        background-color: #F2BB26;
        color: #000;
      }
      .content td {
        background-color: #fff;
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
        <h2>New Order</h2>
      </div>
      <div class="content">
        <h3>Client Information</h3>
        <p><strong>Name:</strong> ${clientData.name}</p>
        <p><strong>ID:</strong> ${clientData.id}</p>

        <h3>Local Information</h3>
        <p><strong>Name:</strong> ${localData.name}</p>
        <p><strong>Address:</strong> ${localData.address}</p>
        <p><strong>Phone:</strong> ${localData.phone}</p>

        <h3>Ordered Products</h3>
        <table>
          <thead>
            <tr>
              <th>Id Product</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Supplier ID</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsList}
          </tbody>
        </table>

        <h3>Suppliers</h3>
        <table>
          <thead>
            <tr>
              <th>Id Supplier</th>
              <th>Name Supplier</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            ${supplierList}
          </tbody>
        </table>
      </div>
      <div class="footer">
        
        <p>Best regards,</p>
        <p>Bodega Team</p>
      </div>
    </div>
  </body>
  </html>
  `;

  // Crear un transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "proyectoapptrader@gmail.com",  // Replace with your Gmail address from environment variables
      pass: "eozh tjoi bdod hwiz"  // Replace with your Gmail password or app-specific password from environment variables
    }
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,  // Replace with your Gmail address
      to: 'ramiro.alet@gmail.com',  // Replace with the actual recipient
      subject: 'New Order',
      html: contentHTML
    });
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: 'Error sending email' };
  }
};