import { where } from 'sequelize';
import Local from '../models/local.js';
import Product from '../models/product.js';
import cloudinary from '../cloudinaryConfig.js';

export const updateImage = async (req, res) => {
  try {
    const { id, action } = req.body;
    const image = req.file;

    console.log(req.body);

    if (!image) {
      res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
      return;
    }

    let modelToUpdate;

    switch (action) {
      case 'shop':
        modelToUpdate = Local;
        break;

      case 'product':
        modelToUpdate = Product;
        break;

      // Agrega casos adicionales para otras acciones si es necesario

      default:
        res.status(400).json({ error: 'Acción no válida' });
        return;
    }

    const uploadResult = await cloudinary.uploader.upload(image.path, {
      folder: action // Subir a la carpeta respectiva en Cloudinary
    });

    const imageUrl = uploadResult.secure_url;

    await modelToUpdate.update({ img: imageUrl }, { where: { id } });

    res.status(200).json({ message: 'Imagen guardada con éxito', imageUrl });

  } catch (err) {
    console.error('Error en la función updateImage:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
  console.log("papa");
};
