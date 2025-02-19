import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import localRoutes from "./routes/local.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productsRouter from "./routes/products.route.js";
import ordersRoutes from "./routes/orders.routes.js";
import routerImages from "./routes/images.routes.js";
import usersRouter from './routes/users.routes.js';
import paymentRouter from './routes/payment.routes.js';
import addresesRouter from './routes/addresses.routes.js';
import { FRONTEND_URL, SSK } from "./config.js";
import Stripe from "stripe";
import { sendEmailWithProducts } from "./functions/sendEmail.js";
import Client from "./models/client.js";
import Local from "./models/local.js";
import clientRouter from "./routes/client.routes.js";
import contactRouter from "./routes/contact.routes.js";
import balanceRequestRouter from "./routes/balanceRequest.routes.js";
import twilioRouter from './routes/twilio.routes.js';
import tagRouter from './routes/tag.routes.js';
import promotionRouter from './routes/promotion.routes.js';
import reviewsRouter from './routes/reviews.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = new Stripe(SSK);

app.use(morgan("dev"));

const corsOptions = {
  origin: [`${FRONTEND_URL}`, "exp://192.168.75.227:8081"],
};
app.use(cors(corsOptions));

app.get('/.well-known/pki-validation/EA9FD8109D014FF58B165491B4D7381D.txt', (req, res) => {
  const filePath = path.join(__dirname, 'bodega-', 'certificados', 'EA9FD8109D014FF58B165491B4D7381D.txt');
  res.sendFile(filePath);
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes);
app.use("/api/local", localRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRoutes);
app.use("/api/up-image", routerImages);
app.use("/api/users", usersRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/addresses", addresesRouter);
app.use('/api/clients', clientRouter);
app.use('/api/contact', contactRouter);
app.use('/api/balanceRequest', balanceRequestRouter);
app.use('/api/twilio', twilioRouter);
app.use('/api/tags', tagRouter);
app.use('/api/promotions', promotionRouter);
app.use('/api/reviews', reviewsRouter);

export default app;
