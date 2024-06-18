import { Router } from "express";
import { addSubscription, getUserById, updateUser } from "../controller/users.controller.js";
import { methods } from "../middleware.js";

const router = Router()

router.get('/get/:id', methods.auth, getUserById)
router.put('/updateUser', methods.auth, updateUser )
router.put('/addSubscription', methods.auth, addSubscription)

export default router