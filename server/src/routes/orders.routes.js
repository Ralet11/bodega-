import { Router } from "express";
import { acceptOrder, getByLocalId, sendOrder, createOrder, getOrderUser, finishOrder } from "../controller/orders.controller.js";

const router = Router()

router.get('/get/:id', getByLocalId )
router.put('/accept/:id', acceptOrder)
router.put('/send/:id', sendOrder)
router.post('/add', createOrder)
router.get('/user/:id', getOrderUser )
router.put('/finished/:id', finishOrder)

export default router