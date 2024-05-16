import DistProduct from "../models/distProducts.model.js"
import nodemailer from 'nodemailer';

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
    const { orderData } = req.body;
  
    // Construir el contenido del correo electrónico
    let productsList = '';
    for (const id_proveedor in orderData) {
      if (orderData.hasOwnProperty(id_proveedor)) {
        const supplierData = orderData[id_proveedor];
        supplierData.products.forEach(product => {
          productsList += `
            <tr>
              <td>${product.name}</td>
              <td>${product.quantity}</td>
              <td>${id_proveedor}</td>
            </tr>
          `;
        });
      }
    }
  
    // Verificar que productsList se está generando correctamente
    console.log(productsList);
  
    const contentHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order</title>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
      </style>
    </head>
    <body>
      <h2>New Order</h2>
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
      <p>If you have any questions, feel free to contact us.</p>
      <p>Best regards,</p>
      <p>Bodega Team</p>
    </body>
    </html>
    `;
    let transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'xxx',  // Reemplaza con tu dirección de correo Hotmail
        pass: 'xxx'   // Reemplaza con tu contraseña
      }
    });
  
    try {
      let info = await transporter.sendMail({
        from: 'xxx',  // Reemplaza con tu dirección de correo Hotmail
        to: 'xxx',  // Reemplaza con el destinatario real
        subject: 'New Order ',
        html: contentHTML
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: 'Error sending email' });
    }
  };