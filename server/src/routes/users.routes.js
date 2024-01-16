import { Router } from "express";
import { getUserById } from "../controller/users.controller.js";

const router = Router()

router.get('/get/:id', getUserById)

export default router