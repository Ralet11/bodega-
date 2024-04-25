import { Router } from "express";
import { getAllCategories } from "../controller/locals_categories.controller.js";
const router = Router()

router.get('/getAll', getAllCategories)



export default router