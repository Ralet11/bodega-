import { Router } from "express";
import { getAllByLocalCat } from "../controller/tag.controller.js";


const router = Router()



router.get('/getAllByLocalCat/:id', getAllByLocalCat)


export default router