import { Router } from "express";
import { getByCategoryId, addProduct, deleteById, UpdateById } from "../controller/products.controller.js";

const router = Router()

router.get('/get/:id', getByCategoryId)
router.post('/add', addProduct)
router.delete('/delete/:id', deleteById)
router.put('/update/:id', UpdateById)

export default router