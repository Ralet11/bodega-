import { Router } from "express";
import { addCategory, getByLocalId, hideById, getAllCategories } from "../controller/category.controller.js";
import { methods as middleware } from "../middleware.js";

const router = Router()

router.get('/get/:id' /* middleware.auth */, getByLocalId)
router.post('/add',middleware.auth, addCategory)
router.delete('/hide/:id',middleware.auth, hideById)
router.get('/getAll',middleware.auth, getAllCategories)



export default router