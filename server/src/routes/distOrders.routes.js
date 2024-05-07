import { Router } from "express";
import { addToLocal } from "../controller/distOrders.controller.js";



const router = Router()

router.post('/add', addToLocal)


export default router