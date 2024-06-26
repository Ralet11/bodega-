import { Router } from "express";
import { tryIntent, getPayMethods, addPayMethod,removePayMethod, createRefund, checkoutDistPayment, checkoutBodegaDistPayment } from "../controller/payment.controller.js";
import { methods as middleware } from "../middleware.js";
const router = Router()

router.post('/intent', tryIntent)
router.get('/getPayMethods',middleware.auth, getPayMethods)
router.post('/enablePayment',middleware.auth, addPayMethod)
router.post('/disablePayment',middleware.auth, removePayMethod)
router.post('/distPayment', middleware.auth, checkoutDistPayment)
router.post('/bodegaPayment', middleware.auth, checkoutBodegaDistPayment)
router.post('/refoundOrder', middleware.auth, createRefund)
export default router