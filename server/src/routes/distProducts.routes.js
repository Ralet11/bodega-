import { Router } from "express";
import { addDistProduct, getAllDistProducts, getDistProductById, sendEmailWithProducts } from "../controller/distProducts.controller.js";
import { methods as middleware } from "../middleware.js";

const router = Router()

router.get('/getAll', middleware.auth, getAllDistProducts)
router.post('/getById', getDistProductById)
router.post('/add', addDistProduct)
router.post('/sendEmailWithOrder', sendEmailWithProducts)



export default router