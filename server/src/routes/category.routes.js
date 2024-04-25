import { Router } from "express";
import { addCategory, getByLocalId, hideById, getAllCategories } from "../controller/category.controller.js";
const router = Router()

router.get('/get/:id', getByLocalId)
router.post('/add', addCategory)
router.delete('/hide/:id', hideById)
router.get('/getAll', getAllCategories)



export default router