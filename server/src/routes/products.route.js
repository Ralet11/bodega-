import { Router } from "express";
import { getByCategoryId, addProduct, deleteById, updateById, getByLocalId } from "../controller/products.controller.js";

const router = Router()

router.get('/get/:id', getByCategoryId)
router.post('/add', addProduct)
router.delete('/delete/:id', deleteById)
router.put('/update/:id', updateById)
router.get('/getByLocalId/:id', getByLocalId)

export default router