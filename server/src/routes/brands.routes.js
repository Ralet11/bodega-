import { Router } from "express";
import { getAllBrands, getAllBrandsByCategory } from "../controller/brands.controller.js";

import { methods } from "../middleware.js";



const router = Router()


router.get('/getAll', methods.auth, getAllBrands)
router.get('/getAllByCategory/:id', methods.auth, getAllBrandsByCategory )



export default router