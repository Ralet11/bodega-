import { Router } from "express";
import { acceptOrder, getByLocalId, sendOrder, createOrder, getOrderUser, finishOrder, getOrdersByUser } from "../controller/orders.controller.js";
import { methods } from "../middleware.js";

const router = Router()

router.get('/get/:id',methods.auth, getByLocalId )
router.put('/accept/:id',methods.auth, acceptOrder)
router.put('/send/:id',methods.auth, sendOrder)
router.post('/add', methods.auth, createOrder)
router.get('/user/:id', methods.auth, getOrderUser )
router.put('/finished/:id',methods.auth, finishOrder)
router.get('/getByUser/:id',methods.auth, getOrdersByUser )
router.post('/getByLocalDay', methods.auth, )

export default router