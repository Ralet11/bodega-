import { Router } from "express";
import { updateImage, uploadBalanceImage } from "../controller/images.controller.js";
import multer from 'multer';
import { methods as middleware } from "../middleware.js";

const routerImages = Router();
const storage = multer.memoryStorage();

// Configuramos los campos que aceptarán archivos en la solicitud
const upload = multer({ storage: storage });

// Ajustamos la configuración de Multer para aceptar también el campo 'image', además de 'logo', 'placeImage' y 'deliveryImage'
const multipleFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'placeImage', maxCount: 1 },
  { name: 'deliveryImage', maxCount: 1 },
  { name: 'img', maxCount: 1 }  // Aquí ya está configurado para aceptar 'file'
]);

// Ruta para subir imágenes relacionadas con la acción (shop, product, discount)
routerImages.post("/", middleware.auth, multipleFields, updateImage);

// Ruta para subir balance, acepta tanto 'file' como 'image'
routerImages.post("/addNewBalance", middleware.auth, upload.single('image'), uploadBalanceImage);

export default routerImages;
