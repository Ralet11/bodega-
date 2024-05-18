import { Router } from "express";
import { getUserById } from "../controller/users.controller.js";
import { methods } from "../middleware.js";

const router = Router()

router.get('/get/:id', methods.auth, getUserById)

export default router