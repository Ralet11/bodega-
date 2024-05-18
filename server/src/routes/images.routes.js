import { Router } from "express";
import { updateImage } from "../controller/images.controller.js";
import multer from 'multer';
import { methods as middleware } from "../middleware.js";

const routerImages = Router();
const upload = multer({ dest: 'uploads/' });

/* routerImages.post("/", upload.single('image'), updateImage); */
routerImages.post("/", middleware.auth, upload.single('image'), updateImage);

export default routerImages;