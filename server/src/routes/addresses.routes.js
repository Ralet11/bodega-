import { Router } from "express";
import { getAddressesByUser } from "../controller/addresses.controller.js";
const router = Router()

router.post('/getById', getAddressesByUser)



export default router