import { Router } from "express";
import {  } from "../controller/products.controller.js";
import { getAll, createDiscount, getDiscountsByUser, getByLocalId, getUserDiscounts, addDiscountToUser, useDiscountUser, getByLocalIdApp, getByCategory, deleteDiscount } from "../controller/discounts.controller.js";
import { methods } from "../middleware.js";
import { TimeoutError } from "sequelize";
import multer from 'multer';

const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/getAll', methods.auth, getAll)
router.post('/add', methods.auth, createDiscount)
router.get('/getByUserId', methods.auth, getDiscountsByUser)
router.get('/getByLocalId/:id', methods.auth, getByLocalId)
router.get('/getByLocalIdApp/:id', methods.auth, getByLocalIdApp)
router.get('/userDiscount/:id', methods.auth, getUserDiscounts)
router.post('/addToUser', methods.auth, addDiscountToUser)
router.post('/useDiscount', methods.auth, useDiscountUser)
router.get('/getByCat/:id', methods.auth, getByCategory)
router.delete('/delete/:id', methods.auth, deleteDiscount)

export default router