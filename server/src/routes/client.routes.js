import { Router } from "express";
import { changePassword, checkStripeStatus, completeTutorial, createStripeAccount, getAllClients, getClientById, getClientSecurityData, updateClient } from "../controller/clients.controller.js";

import { methods } from "../middleware.js";
const clientRouter = Router();


clientRouter.post("/completeTutorial", methods.auth, completeTutorial)
clientRouter.get("/clients", getAllClients)
clientRouter.get("/:id", getClientById)
clientRouter.put("/update", methods.auth, updateClient)
clientRouter.put("/change-password", methods.auth, changePassword)
clientRouter.get("/sett/idssn", methods.auth, getClientSecurityData)
clientRouter.post("/stripe/create-connected-account", methods.auth, createStripeAccount )
clientRouter.get('/stripe/login-link/:clientId', methods.auth, checkStripeStatus)

export default clientRouter