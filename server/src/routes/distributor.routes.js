import { Router } from "express";
import { createDistributor } from "../controller/distributor.controller";

const router = Router()


router.post('/createDistributor', createDistributor)


export default router