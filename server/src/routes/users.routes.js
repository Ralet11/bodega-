import { Router } from "express";
import { getUserById, updateUser } from "../controller/users.controller.js";
import { methods } from "../middleware.js";

const router = Router()

router.get('/get/:id', methods.auth, getUserById)
router.put('/updateUser', methods.auth, updateUser )

export default router