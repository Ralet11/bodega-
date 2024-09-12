import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Local from '../models/local.js';
import Product from '../models/product.js';
import Discount from '../models/discount.js';
import BalanceRequest from '../models/balanceRequest.model.js';
import {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME} from '../config.js';

// Configuración de S3
const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});


// Función para actualizar imágenes
export const updateImage = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File received:', req.files);

  try {
      const { id, action } = req.body;

      if (!req.files || Object.keys(req.files).length === 0) {
          console.log('No files received');
          return res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
      }

      let modelToUpdate;
      let imageFields = []; // Para almacenar los campos de imagen

      // Determinar el modelo y los campos de la imagen en función de la acción
      switch (action) {
          case 'shop':
              modelToUpdate = Local;
              imageFields = ['logo', 'placeImage', 'deliveryImage']; // Campos de imagen para la tienda
              break;
          case 'product':
              modelToUpdate = Product;
              imageFields = ['img']; // Para productos, solo se actualiza 'img'
              break;
          case 'discount':
              modelToUpdate = Discount;
              imageFields = ['img']; // Para descuentos, también se actualiza 'img'
              break;
          default:
              return res.status(400).json({ error: 'Acción no válida' });
      }

      // Objeto para almacenar las actualizaciones
      let updateData = {};

      // Guardar las imágenes enviadas
      for (let field of imageFields) {
          if (req.files[field]) {
              const file = req.files[field][0]; // Acceder al archivo
              console.log(`Procesando archivo para campo: ${field}`);

              const fileName = `${Date.now()}_${file.originalname}`;
              const params = {
                  Bucket: AWS_BUCKET_NAME,
                  Key: `${action}/${fileName}`,
                  Body: file.buffer,
                  ContentType: file.mimetype
              };

              // Subir la imagen a S3
              try {
                  const uploadResult = await s3Client.send(new PutObjectCommand(params));
                  console.log(`Upload result for ${field}:`, uploadResult);

                  // Guardar la URL pública de la imagen en el campo correspondiente
                  updateData[field === 'file' ? 'img' : field] = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${action}/${fileName}`;
              } catch (error) {
                  console.error(`Error al subir el archivo ${field}`, error);
                  return res.status(500).json({ error: `Error al subir el archivo ${field}` });
              }
          } else {
              console.log(`No se encontró un archivo para el campo ${field}`);
          }
      }

      // Verificar si hay datos para actualizar
      if (Object.keys(updateData).length > 0) {
          // Actualizar el modelo con las URLs de las imágenes
          console.log('Update al modelo:', updateData);
          const updatedRecord = await modelToUpdate.update(updateData, { where: { id } });

          if (updatedRecord) {
              return res.status(200).json({ message: 'Imágenes guardadas con éxito', updateData });
          } else {
              return res.status(404).json({ error: 'No se encontró el registro para actualizar' });
          }
      } else {
          return res.status(400).json({ error: 'No se proporcionaron imágenes válidas' });
      }

  } catch (err) {
      console.error('Error en la función updateImage:', err);
      return res.status(500).json({ error: err.message });
  }
};

// Función para subir imágenes de balance
export const uploadBalanceImage = async (req, res) => {
    const { id, comment, amount } = req.body;
    console.log(id, comment, amount);

    const idConfirm = req.user.clientId;
    console.log(idConfirm);

    if (id !== String(idConfirm)) {
        return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No se ha recibido ningún archivo' });
        }

        const fileName = `${Date.now()}_${file.originalname}`;
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `action/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        // Subir a S3
        const uploadResult = await s3Client.send(new PutObjectCommand(params));
        const imageUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/action/${fileName}`;

        // Crear una nueva solicitud de saldo
        const newBalanceRequest = await BalanceRequest.create({
            client_id: id,
            amount,
            comment,
            statusBalance_id: 1,
            img: imageUrl
        });

        res.status(200).json({ message: "File uploaded successfully", balanceRequest: newBalanceRequest });
    } catch (error) {
        console.error('Error en la carga del archivo', error);
        res.status(500).json({ error: "Error processing file upload", details: error });
    }
};
