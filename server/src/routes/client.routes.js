import { Router } from "express";
import { changePassword, completeTutorial, getAllClients, getClientById, updateClient } from "../controller/clients.controller.js";

import { methods } from "../middleware.js";
const clientRouter = Router();


clientRouter.post("/completeTutorial", methods.auth, completeTutorial)
clientRouter.get("/clients", getAllClients)
clientRouter.get("/:id", getClientById)
clientRouter.put("/update", methods.auth, updateClient)
clientRouter.put("/change-password", methods.auth, changePassword)



export default clientRouter