import { Router } from "express";
import { getAllCategories, getAllCategoriesApp } from "../controller/locals_categories.controller.js";
const router = Router()

router.get('/getAll', getAllCategories)
router.get('/app/getAll', getAllCategoriesApp)


export default router