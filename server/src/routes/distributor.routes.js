import { Router } from "express";
import { createDistributor, getDistributors } from "../controller/distributor.controller";

const router = Router()


router.post('/createDistributor', createDistributor)
router.get('/getDistributors', getDistributors)


export default router