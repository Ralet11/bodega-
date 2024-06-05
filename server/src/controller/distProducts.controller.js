import DistProduct from "../models/distProducts.model.js"
import nodemailer from 'nodemailer';
import { Op } from "sequelize";

export const getAllDistProducts = async (req, res) => {
    try {
        const response = await DistProduct.findAll()

        res.status(200).json(response)
    } catch (error) {
        res.json(error)
    }
}

export const addDistProduct = async (req, res) => {
    const { id_proveedor, name, category, price, description, image1, image2, image3,feature_1, feature_2, feature_3 } = req.body

    try {
        // Crear un nuevo producto distribuido
        const newProduct = await DistProduct.create({
            id_proveedor,
            name,
            category,
            price,
            description,
            image1,
            image2,
            image3,
            feature_1,
            feature_2,
            feature_3
        });

        res.status(201).json(newProduct);
       
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el producto" });
        console.log(error)
    }
}

export const getDistProductById = async (req, res) => {
    const { id } = req.params; // Cambiado de req.body a req.params para obtener el ID de la URL

    try {
        // Encontrar el producto distribuido por su ID
        const product = await DistProduct.findByPk(id);

        if (product) {
            // Si se encuentra el producto, enviarlo como respuesta
            res.status(200).json(product);
        } else {
            // Si no se encuentra el producto, devolver un error
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        // Si hay algún error, devolver un mensaje de error genérico
        res.status(500).json({ error: "Error al obtener el producto" });
    }
}

export const sendEmailWithProducts = async (req, res) => {
  const { orderData, clientData, localData } = req.body.data;

  console.log("enviando mail")
  
  /* // Construct the email content
  let productsList = '';
  for (const id_proveedor in orderData) {
    if (orderData.hasOwnProperty(id_proveedor)) {
      const supplierData = orderData[id_proveedor];
      supplierData.products.forEach(product => {
        productsList += `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${product.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${id_proveedor}</td>
          </tr>
        `;
      });
    }
  }

  // Verify that productsList is being generated correctly
  console.log(productsList);

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
              <th>Product</th>
              <th>Quantity</th>
              <th>Supplier ID</th>
            </tr>
          </thead>
          <tbody>
            ${productsList}
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

  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "proyectoapptrader@gmail.com",  // Replace with your Gmail address from environment variables
      pass: "eozh tjoi bdod hwiz"   // Replace with your Gmail password or app-specific password from environment variables
    }
  });

  try {
    let info = await transporter.sendMail({
      from: "proyectoapptrader@gmail.com",  // Replace with your Gmail address
      to: 'ramiro.alet@gmail.com',  // Replace with the actual recipient
      subject: 'New Order',
      html: contentHTML
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: 'Error sending email' });
  }  */
};


export const searchProducts = async (req, res) => {
  const query = req.query.query;
  const searchTerms = query.split(' '); // Divide el término de búsqueda en palabras

  try {
    const results = await DistProduct.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`, // Coincidencia completa del término de búsqueda
            },
          },
          {
            name: {
              [Op.iLike]: { [Op.any]: searchTerms.map(term => `%${term}%`) }, // Coincidencia de cualquier palabra del término de búsqueda
            },
          },
          {
            tags: {
              [Op.overlap]: searchTerms, // Coincidencia de cualquier palabra del término de búsqueda en los tags
            },
          },
        ],
      },
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for products.' });
  }
};