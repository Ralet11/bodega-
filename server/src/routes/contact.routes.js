import { Router } from "express";
import { sendEmailContact } from "../controller/contact.controller.js";


const contactRouter = Router();

contactRouter.post("/sendContactMail", sendEmailContact)



export default contactRouter