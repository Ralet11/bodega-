import { Router } from "express";
import { tryIntent, getPayMethods, addPayMethod,removePayMethod } from "../controller/payment.controller.js";

const router = Router()

router.post('/intent', tryIntent)
router.get('/getPayMethods', getPayMethods)
router.post('/enablePayment', addPayMethod)
router.post('/disablePayment', removePayMethod)

export default router