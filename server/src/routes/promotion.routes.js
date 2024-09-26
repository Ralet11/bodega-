import { Router } from "express";
import  { createPromotion, getByLocal, getPromotionTypes, getUserPromotions } from "../controller/promotions.controller.js";
import { methods } from "../middleware.js";

const router = Router()

router.post('/create', methods.auth, createPromotion)
router.get('/getPromotionTypes', methods.auth, getPromotionTypes)
router.get('/getByLocal/:id', methods.auth, getByLocal)
router.post('/getUserPromotions', methods.auth, getUserPromotions )

export default router