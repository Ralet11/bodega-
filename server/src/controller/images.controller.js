import { where } from 'sequelize';
import Local from '../models/local.js';
import Product from '../models/product.js';
import fs from 'fs';
import path from 'path';

export const updateImage = async (req, res) => {
  try {
    const { id, action } = req.body;
    const image = req.file;

    console.log(req.body)

    if (!image) {
      res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
      return;
    }

    let targetPath;

    switch (action) {
      case 'shop':
        const local = await Local.findByPk(id);

        if (!local) {
          res.status(404).json({ error: 'Local no encontrado' });
          return;
        }

        const localName = local.name;
        const ext = path.extname(image.originalname);
        targetPath = `uploads/${localName}${ext}`;
        break;

      case 'product':
        const product = await Product.findOne({
          where: {
            id: id
          }
        });

        if (!product) {
          res.status(404).json({ error: 'Producto no encontrado' });
          return;
        }

        const productName = product.name;
        const prodext = path.extname(image.originalname);
        targetPath = `uploads/${productName}${prodext}`;
        break;

      // Agrega casos adicionales para otras acciones si es necesario

      default:
        res.status(400).json({ error: 'Acción no válida' });
        return;
    }

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath); // Elimina el archivo existente si existe
    }

    fs.rename(image.path, targetPath, async (err) => {
      if (err) {
        console.error('Error al mover la imagen:', err);
        res.status(500).json({ error: 'Error al guardar la imagen' });
      } else {
        try {
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

          await modelToUpdate.update({ img: targetPath }, { where: { id } });

          res.status(200).json({ message: 'Imagen guardada con éxito' });
        } catch (dbError) {
          console.error('Error al actualizar la base de datos:', dbError);
          res.status(500).json({ error: 'Error al actualizar la base de datos' });
        }
      }
    });
  } catch (err) {
    console.error('Error en la función updateImage:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
  console.log("papa")
};
