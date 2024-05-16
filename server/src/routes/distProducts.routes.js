import { Router } from "express";
import { addDistProduct, getAllDistProducts, getDistProductById, sendEmailWithProducts } from "../controller/distProducts.controller.js";


const router = Router()

router.get('/getAll', getAllDistProducts)
router.post('/getById', getDistProductById)
router.post('/add', addDistProduct)
router.post('/sendEmailWithOrder', sendEmailWithProducts)



export default router