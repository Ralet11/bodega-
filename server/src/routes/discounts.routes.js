import { Router } from "express";
import {  } from "../controller/products.controller.js";
import { getAll, createDiscount, getDiscountsByUser, getByLocalId } from "../controller/discounts.controller.js";
import { methods } from "../middleware.js";
import { TimeoutError } from "sequelize";

const router = Router()

router.get('/getAll', getAll)
router.post('/add', createDiscount)
router.get('/getByUserId', methods.auth, getDiscountsByUser)
router.post('/getByLocalId', getByLocalId)


export default router