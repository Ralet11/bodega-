import { Router } from "express";
import { addToLocal, getByLocalId } from "../controller/distOrders.controller.js";



const router = Router()

router.post('/add', addToLocal)
router.post('/getByLocalId', getByLocalId)


export default router