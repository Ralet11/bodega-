import { Router } from "express";
import { getAllClients, getClientById } from "../controller/clients.controller.js";


const clientRouter = Router();

clientRouter.get("/clients", getAllClients)
clientRouter.get("/clients/:id", getClientById)


export default clientRouter