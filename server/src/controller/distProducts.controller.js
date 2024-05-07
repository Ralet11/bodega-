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
        const email = 'xxx'
        sendEmailWithProducts(email)
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

export const sendEmailWithProducts = async (email) => {
    const contentHTML = `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome Email</title>
  </head>
  <body>
      <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
          <tr>
              <td style="background-color: #4299e1; color: white; padding: 20px; text-align: center;">
                  <h2>Congratulations</h2>
                  <p>You buy a new product!</p>
              </td>
          </tr>
          
          <tr>
              <td style="background-color: #f8fafc; padding: 20px; text-align: center;">
                  <p>If you have any questions, feel free to contact us.</p>
                  <p class="text-gray-700">Best regards,</p>
                  <p class="text-gray-700">Bodega Team</p>
              </td>
          </tr>
      </table>
  </body>
  </html>
    `;
  
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'xxx',
          pass: 'xxx'
        }
      });
    
    try {
    let info = await transporter.sendMail({
        from: 'xxx',
        to: email,
        subject: 'Congrats for your new purchase!',
        html: contentHTML
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
    console.log("Error sending email:", error);
    }
  }
  