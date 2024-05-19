import { Router } from "express";
import { tryIntent, getPayMethods, addPayMethod,removePayMethod, checkoutDistPayment } from "../controller/payment.controller.js";
import { methods as middleware } from "../middleware.js";
const router = Router()

router.post('/intent', tryIntent)
router.get('/getPayMethods',middleware.auth, getPayMethods)
router.post('/enablePayment',middleware.auth, addPayMethod)
router.post('/disablePayment',middleware.auth, removePayMethod)
router.post('/distPayment', middleware.auth, checkoutDistPayment)

export default router