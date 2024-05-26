import { Router } from "express";


import { methods } from "../middleware.js";
import { getByClientId } from "../controller/balanceRequest.controller.js";


const router = Router()


router.get('/getByClient/:id', methods.auth, getByClientId)



export default router