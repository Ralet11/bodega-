import { Router } from "express";
import { addToLocal, getByLocalId } from "../controller/distOrders.controller.js";
import { methods as middleware } from "../middleware.js";


const router = Router()

router.post('/add', middleware.auth, addToLocal)
router.post('/getByLocalId', middleware.auth, getByLocalId)


export default router