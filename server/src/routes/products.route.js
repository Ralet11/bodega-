import { Router } from "express";
import { getByCategoryId, addProduct, deleteById, getByLocalId, getProductsByClientId, getByProductId, saveExtras, uploadExcelToCategory, updateProduct, getInventoryProducts, pushInventoryProduct } from "../controller/products.controller.js";
import { methods as middleware } from "../middleware.js";
const router = Router()

router.get('/get/:id', /* middleware.auth, */ getByCategoryId)
router.post('/add', middleware.auth, addProduct)
router.delete('/delete/:id', middleware.auth, deleteById)

router.get('/getByLocalId/:id', middleware.auth, getByLocalId)

router.get('/getByClientId/:id', middleware.auth, getProductsByClientId) // Nueva ruta para obtener productos por clientId
router.put('/update-product', middleware.auth, updateProduct)
router.post('/getByProductId', middleware.auth, getByProductId)
router.put('/update-extras', middleware.auth, saveExtras )
router.post('/excellUploadInCatgeory/:id', middleware.auth, uploadExcelToCategory)
router.get('/inventory', getInventoryProducts);
router.put('/inventory/:productId', pushInventoryProduct);


export default router