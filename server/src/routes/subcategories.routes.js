import { Router } from "express";
import {getAllSubcategories} from '../controller/subcategories.controller.js'
import { methods } from "../middleware.js";

const router = Router()

router.get('/getAll', methods.auth, getAllSubcategories)

export default router