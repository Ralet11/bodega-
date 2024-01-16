import getConnection from "../database.js";
import fs from 'fs';
import path from 'path';

export const updateImage = async (req, res) => {
  try {
    const { id, action } = req.body;
    const image = req.file;
    console.log(id)

    if (!image) {
      res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
      return;
    }

    let targetPath;

    switch (action) {
      
      case 'shop':
        const connection = await getConnection();
        const shopResult = await connection.query('SELECT * FROM local WHERE local.id = ?', [id]);

        if (shopResult.length === 0) {
          res.status(404).json({ error: 'Local no encontrado' });
          return;
        }

        const localName = shopResult[0].name;
        const ext = path.extname(image.originalname);
        targetPath = `uploads/${localName}${ext}`;
        break;

      case 'product':
        console.log("papa")
        const prod_connection = await getConnection()
        const prodResult = await prod_connection.query('SELECT * FROM products WHERE id = ?', [id]);
        console.log(prodResult)

        if (prodResult.length === 0) {
          res.status(404).json({ error: 'producto no encontrado' });
          return;
        }

        const productName = prodResult[0].name;
        const prodext = path.extname(image.originalname);
        targetPath = `uploads/${productName}${prodext}`;
        break;


      case 'otraAccion':
        // ... Lógica para 'otraAccion'
        break;

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
          const connection = await getConnection();
          let tableToUpdate;

          switch (action) {
            case 'shop':
              tableToUpdate = 'local';
              break;

            case 'product':
              tableToUpdate = 'products';
              break;

            case 'otraAccion':
              // Define la tabla correspondiente para 'otraAccion'
              tableToUpdate = 'nombre_de_la_tabla';
              break;

            default:
              // En caso de una acción no válida, no deberías llegar a este punto
              res.status(400).json({ error: 'Acción no válida' });
              return;
          }

          await connection.query(`UPDATE ${tableToUpdate} SET img=? WHERE id = ?`, [targetPath, id]);

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
};
