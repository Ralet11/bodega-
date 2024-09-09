import { where } from 'sequelize';
import Local from '../models/local.js';
import Product from '../models/product.js';
import cloudinary from '../cloudinaryConfig.js';
import BalanceRequest from '../models/balanceRequest.model.js';
import Discount from '../models/discount.js';

cloudinary.config({
  cloud_name: "doqyrz0sg",
  api_key: "514919588344698",
  api_secret: "bv6pnA7aXQMK4VSjm5qwMIvBk3s",
});

export const updateImage = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File received:', req.files); // Verifica si se recibieron archivos

  try {
    const { id, action } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files received');
      return res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
    }

    let modelToUpdate;

    // Determinar el modelo en función de la acción
    switch (action) {
      case 'shop':
        modelToUpdate = Local;
        break;
      case 'product':
        modelToUpdate = Product;
        break;
      case 'discount':
        modelToUpdate = Discount;
        break;
      default:
        return res.status(400).json({ error: 'Acción no válida' });
    }

    // Guardar las imágenes que fueron enviadas
    let imageFields = ['logo', 'placeImage', 'deliveryImage'];
    let updateData = {};

    for (let field of imageFields) {
      if (req.files[field]) {
        const file = req.files[field][0];
        const fileContent = file.buffer.toString('base64');

        // Subir la imagen a Cloudinary
        const uploadResult = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${fileContent}`, {
          folder: action
        });

        console.log(`Upload result for ${field}:`, uploadResult);
        updateData[field] = uploadResult.secure_url; // Actualizar el campo correspondiente en la DB
      }
    }

    // Si hay datos para actualizar, realizar la actualización en la base de datos
    if (Object.keys(updateData).length > 0) {
      await modelToUpdate.update(updateData, { where: { id } });
      return res.status(200).json({ message: 'Imágenes guardadas con éxito', updateData });
    } else {
      return res.status(400).json({ error: 'No se proporcionaron imágenes válidas' });
    }

  } catch (err) {
    console.error('Error en la función updateImage:', err);
    return res.status(500).json({ error: err.message });
  }
};



export const uploadBalanceImage = async (req, res) => {

  const {id, comment, amount} = req.body

  console.log(id, comment, amount)

  const idConfirm = req.user.clientId

  console.log(idConfirm)

  if (id !== String(idConfirm)) {
    return res.status(403).json({ message: "Forbidden. Client ID does not match." });
  }

  try {
      const fileContent = req.file.buffer.toString('base64');
      

      // Subir a Cloudinary directamente desde el buffer
      const uploadResult = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileContent}`, {
          folder: 'action'
      });

      const imageUrl = uploadResult.secure_url;

      const newBalanceRequest = await BalanceRequest.create({
        client_id: id,
        amount,
        comment,
        statusBalance_id: 1,
        img: imageUrl
      })
      
      

      res.status(200).json({ message: "File uploaded successfully", balanceRequest: newBalanceRequest });
  } catch (error) {
      res.status(500).json({ error: "Error processing file upload", details: error });
      console.log(error)
  }

};