import { Router } from "express";
import { getByCategoryId, addProduct, deleteById, updateById, getByLocalId } from "../controller/products.controller.js";
import { methods as middleware } from "../middleware.js";
const router = Router()

router.get('/get/:id',middleware.auth, getByCategoryId)
router.post('/add',middleware.auth, addProduct)
router.delete('/delete/:id',middleware.auth, deleteById)
router.put('/update/:id',middleware.auth, updateById)
router.get('/getByLocalId/:id', middleware.auth, getByLocalId)

export default router