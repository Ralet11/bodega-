import { Router } from "express";
import { updateImage, uploadBalanceImage } from "../controller/images.controller.js";
import multer from 'multer';
import { methods as middleware } from "../middleware.js";

const routerImages = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routerImages.post("/", middleware.auth, upload.single('file'), updateImage);
routerImages.post("/addNewBalance", middleware.auth, upload.single('file'), uploadBalanceImage);

export default routerImages;