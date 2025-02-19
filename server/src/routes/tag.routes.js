import { Router } from "express";
import { getAll } from "../controller/tag.controller.js";


const router = Router()



router.get('/getAll', getAll)


export default router