import { Router } from "express";
import { sendContactAppMail, sendEmailContact } from "../controller/contact.controller.js";


const contactRouter = Router();

contactRouter.post("/sendContactMail", sendEmailContact)
contactRouter.post('/sendContactAppMail', sendContactAppMail )



export default contactRouter