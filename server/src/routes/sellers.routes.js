import { Router } from "express";

import { methods } from "../middleware.js";
import { createStripeAccount, getAffiliatedShops } from "../controller/sellers.controller.js";
const sellersRouter = Router();


sellersRouter.get("/getShops", methods.auth, getAffiliatedShops)
sellersRouter.post("/stripe/create-connected-account", methods.auth,createStripeAccount )




export default sellersRouter