import { Router } from "express";
import {  } from "../controller/products.controller.js";
import { getAll, createDiscount, getDiscountsByUser, getByLocalId } from "../controller/discounts.controller.js";
import { methods } from "../middleware.js";
import { TimeoutError } from "sequelize";

const router = Router()

router.get('/getAll', methods.auth, getAll)
router.post('/add', methods.auth, createDiscount)
router.get('/getByUserId', methods.auth, getDiscountsByUser)
router.get('/getByLocalId/:id', methods.auth, getByLocalId)


export default router