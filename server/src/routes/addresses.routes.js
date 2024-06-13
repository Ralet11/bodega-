import { Router } from "express";
import { addAddressToUser, getAddressesByUser } from "../controller/addresses.controller.js";
import { methods } from "../middleware.js";
const router = Router()

router.get('/getById', methods.auth, getAddressesByUser)
router.post('/addToUser', methods.auth, addAddressToUser)



export default router