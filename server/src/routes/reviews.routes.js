import { Router } from "express";
import { createReview, getAllReviewsByLocal } from "../controller/reviews.controller.js";
import { methods } from "../middleware.js";

const router = Router()

router.post('/create', methods.auth, createReview)
router.get('/getByLocal/:local_id', methods.auth, getAllReviewsByLocal)


export default router