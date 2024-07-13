import { Router } from "express"
import { methods as middleware } from "../middleware.js";
import { getShopsByClientId ,getByClientId, getById, changeStatus, updateShop, updateAddress, getActiveShops, getAllShops, addShop, getLocalCategoriesAndProducts, getShopsOrderByCat, changeRating, addService, removeService, sendCertificate } from "../controller/local.controller.js"
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router()

router.get("/get", middleware.auth, getByClientId);
router.get("/get/:id", getById)
router.post("/change-status/:id", changeStatus)
router.put('/update/:id',middleware.auth, updateShop)
router.post('/update/address/:id',middleware.auth, updateAddress)
router.get('/activeShops', getActiveShops)
router.get('/getAllShops', getAllShops)
router.post('/add', middleware.auth, addShop)
router.get('/getByClient', getByClientId)
router.get('/:localId/categories', getLocalCategoriesAndProducts);
router.get('/getShopsOrderByCat', getShopsOrderByCat)
router.get('/byClientId', getShopsByClientId);
router.post('/rating', changeRating);
router.post('/addService/:id', middleware.auth, addService)
router.post('/removeService/:id', middleware.auth, removeService)
router.post('/uploadCertificate/', middleware.auth, upload.single('certificate'), sendCertificate)

export default router