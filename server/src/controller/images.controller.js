import { where } from 'sequelize';
import Local from '../models/local.js';
import Product from '../models/product.js';
import cloudinary from '../cloudinaryConfig.js';
import BalanceRequest from '../models/balanceRequest.model.js';

cloudinary.config({
  cloud_name: "doqyrz0sg",
  api_key: "514919588344698",
  api_secret: "bv6pnA7aXQMK4VSjm5qwMIvBk3s",
});

export const updateImage = async (req, res) => {
  console.log('File received1:', req.file);
  
  try {
    const { id, action } = req.body;
    
    console.log('File received2:', req.file);

    if (!req.file) {
      res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
      return;
    }

    const fileContent = req.file.buffer.toString('base64');

    console.log('Base64 file content:', fileContent.substring(0, 30) + '...'); // Mostrar solo el inicio del contenido para evitar log largos

    let modelToUpdate;

    switch (action) {
      case 'shop':
        modelToUpdate = Local;
        break;

      case 'product':
        modelToUpdate = Product;
        break;

      default:
        res.status(400).json({ error: 'Acción no válida' });
        return;
    }

    const uploadResult = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileContent}`, {
      folder: action
    });

    console.log('Upload result:', uploadResult);

    const imageUrl = uploadResult.secure_url;

    await modelToUpdate.update({ img: imageUrl }, { where: { id } });

    res.status(200).json({ message: 'Imagen guardada con éxito', imageUrl });

  } catch (err) {
    console.error('Error en la función updateImage:', err);
    res.status(500).json({ error: err.message });
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