import { Router } from "express"
import { methods as middleware } from "../middleware.js";
import { getByClientId, getById, changeStatus, updateShop, updateAddress, getActiveShops, getAllShops } from "../controller/local.controller.js"

const router = Router()

router.get("/get", middleware.auth, getByClientId);
router.get("/get/:id", getById)
router.post("/change-status/:id", changeStatus)
router.put('/update/:id', updateShop)
router.post('/update/address/:id', updateAddress)
router.get('/activeShops', getActiveShops)
router.get('/getAllShops', getAllShops)

export default router