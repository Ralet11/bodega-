import { Router } from "express";
import { getByCategoryId, addProduct, deleteById, updateProductAndDiscount, getByLocalId, getProductsByClientId, getByProductId, saveExtras, uploadExcelToCategory } from "../controller/products.controller.js";
import { methods as middleware } from "../middleware.js";
const router = Router()

router.get('/get/:id', /* middleware.auth, */ getByCategoryId)
router.post('/add', middleware.auth, addProduct)
router.delete('/delete/:id', middleware.auth, deleteById)
router.put('/update-product-and-discount', middleware.auth, updateProductAndDiscount)
router.get('/getByLocalId/:id', middleware.auth, getByLocalId)

router.get('/getByClientId/:id', middleware.auth, getProductsByClientId) // Nueva ruta para obtener productos por clientId

router.post('/getByProductId', middleware.auth, getByProductId)
router.put('/update-extras', middleware.auth, saveExtras )
router.post('/excellUploadInCatgeory/:id', middleware.auth, uploadExcelToCategory)

export default router
