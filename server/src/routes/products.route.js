import { Router } from "express";
import { getByCategoryId, addProduct, deleteById, updateById, getByLocalId } from "../controller/products.controller.js";
import { methods as middleware } from "../middleware.js";
const router = Router()

router.get('/get/:id', getByCategoryId)
router.post('/add', addProduct)
router.delete('/delete/:id', deleteById)
router.put('/update/:id', updateById)
router.get('/getByLocalId/:id', middleware.auth, getByLocalId)

export default router