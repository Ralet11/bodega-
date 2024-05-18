import { Router } from "express";
import { acceptOrder, getByLocalId, sendOrder, createOrder, getOrderUser, finishOrder, getOrdersByUser } from "../controller/orders.controller.js";
import { methods } from "../middleware.js";

const router = Router()

router.get('/get/:id',methods.auth, getByLocalId )
router.put('/accept/:id', acceptOrder)
router.put('/send/:id', sendOrder)
router.post('/add', methods.auth, createOrder)
router.get('/user/:id', methods.auth, getOrderUser )
router.put('/finished/:id', finishOrder)
router.get('/getByUser/:id', getOrdersByUser )

export default router