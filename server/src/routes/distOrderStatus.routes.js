import { Router } from "express";
import { createDistOrderStatus, deleteDistOrderStatus, getAllDistOrderStatus, updateDistOrderStatus, getDistOrderStatusById } from "../controller/distOrderStatus.controller.js";



const distOrderStatusRouter = Router();

// Ruta para crear un nuevo estado de orden
distOrderStatusRouter.post("/createStatus", createDistOrderStatus);
distOrderStatusRouter.post("/deleteStatus/:id", deleteDistOrderStatus);
distOrderStatusRouter.post("/updateStatus/:id", updateDistOrderStatus);
distOrderStatusRouter.get("/getStatus", getAllDistOrderStatus);
distOrderStatusRouter.get("/getStatusById/:id", getDistOrderStatusById);



export default distOrderStatusRouter;
