import { Router } from "express";

import { methods } from "../middleware.js";
import { getAffiliatedShops } from "../controller/sellers.controller.js";
const sellersRouter = Router();


sellersRouter.get("/getShops", methods.auth, getAffiliatedShops)




export default sellersRouter