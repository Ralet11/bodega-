import { Router } from "express";
import { updateImage, uploadBalanceImage } from "../controller/images.controller.js";
import multer from 'multer';
import { methods as middleware } from "../middleware.js";

const routerImages = Router();
const storage = multer.memoryStorage();

// Cambia de upload.single() a upload.fields() para aceptar múltiples campos de archivo
const upload = multer({ storage: storage });

// Configuramos los campos que aceptarán archivos en la solicitud
const multipleFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'placeImage', maxCount: 1 },
  { name: 'deliveryImage', maxCount: 1 }
]);

// Modificamos la ruta para aceptar múltiples archivos
routerImages.post("/", middleware.auth, multipleFields, updateImage);
routerImages.post("/addNewBalance", middleware.auth, upload.single('file'), uploadBalanceImage);

export default routerImages;