import { Router } from "express";
import { getAllClients, getClientById, updateClient } from "../controller/clients.controller.js";

import { methods } from "../middleware.js";
const clientRouter = Router();

clientRouter.get("/clients", getAllClients)
clientRouter.get("/:id", getClientById)
clientRouter.put("/update", methods.auth, updateClient)


export default clientRouter