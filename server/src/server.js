/* import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import localRoutes from "./routes/local.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productsRouter from "./routes/products.route.js";
import cors from "cors";
import ordersRoutes from "./routes/orders.routes.js";
import { Server } from "socket.io";
import http from "http";
import routerImages from "./routes/images.routes.js";
import usersRouter from './routes/users.routes.js'
import paymentRouter from './routes/payment.routes.js'
import localsCategories from './routes/locals_catogories.routes.js'
import addresesRouter from './routes/addresses.routes.js'
import discountRouter from './routes/discounts.routes.js'
import DistProductRouter from './routes/distProducts.routes.js'
import distOrderRouter from './routes/distOrders.routes.js'
import { FRONTEND_URL } from "./config.js";

const app = express();
const server = http.createServer(app);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

const corsOptions = {
  origin: [`${FRONTEND_URL}`, "exp://192.168.75.227:8081"],
};
app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'))
app.use("/api/auth", authRoutes);
app.use("/api/local", localRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRoutes);
app.use("/api/up-image", routerImages);
app.use("/api/users", usersRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/locals_categories", localsCategories);
app.use("/api/addresses", addresesRouter);
app.use("/api/discounts", discountRouter);
app.use("/api/distProducts", DistProductRouter);
app.use("/api/distOrder", distOrderRouter);



const io = new Server(server, {
  cors: {
    origin: `${FRONTEND_URL}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Cliente WebSocket conectado.");

  
  socket.emit("message", "¡Conexión establecida!");

  
  socket.on("message", (message) => {
    console.log(`Mensaje recibido: ${message}`);
  });

 
  socket.on("disconnect", () => {
    console.log("Cliente WebSocket desconectado.");
  });
});

export { io };
export default app;
 */


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
import localsCategories from './routes/locals_catogories.routes.js';
import addresesRouter from './routes/addresses.routes.js';
import discountRouter from './routes/discounts.routes.js';
import DistProductRouter from './routes/distProducts.routes.js';
import distOrderRouter from './routes/distOrders.routes.js';
import distOrderStatusRouter from "./routes/distOrderStatus.routes.js";
import { FRONTEND_URL, SSK } from "./config.js";
import Stripe from "stripe";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";

const app = express();
const stripe = new Stripe(SSK);

const endpointSecret = "whsec_9d9dffedc83b18c6cb3f360a0332c541e2f9a2362d625d1968196a540566d3d6";

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));
app.use(bodyParser.raw({ type: "*/*" }))
app.use(cookieParser());

// Configuración de CORS
const corsOptions = {
  origin: [`${FRONTEND_URL}`, "exp://192.168.75.227:8081"],
};
app.use(cors(corsOptions));

// Rutas
app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes);
app.use("/api/local", localRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRoutes);
app.use("/api/up-image", routerImages);
app.use("/api/users", usersRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/locals_categories", localsCategories);
app.use("/api/addresses", addresesRouter);
app.use("/api/discounts", discountRouter);
app.use("/api/distProducts", DistProductRouter);
app.use("/api/distOrder", distOrderRouter);
app.use("/api/distOrderStatus", distOrderStatusRouter);

// Ruta del webhook de Stripe
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => { 
    const sig = request.headers["stripe-signature"];
    const bodyString = request.body.toString();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        bodyString,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    let resData = "";

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        customer = paymentIntent.customer
        payMethod = paymentIntent.payment_method
        if (paymentIntent.amount === 60000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P2MQQCtqRjqS5chcgCR4WJ2", payMethod)
        } else if(paymentIntent.amount === 25000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P2MPqCtqRjqS5chqiRgs0jA", payMethod)
        } else if (paymentIntent.amount === 15000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P2LOSCtqRjqS5ch03lA7nKo", payMethod)
        }

        /* if (paymentIntent.amount === 60000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P4XNOIrqUJwwaEOzJfiunHk", payMethod)
        } else if(paymentIntent.amount === 25000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P4XN7IrqUJwwaEO74KcP17W", payMethod)
        } else if (paymentIntent.amount === 15000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P4XLgIrqUJwwaEOjHD2sGNq", payMethod)
        } */

      case "charge.succeeded":
         payMethod = event.data.object.payment_method;
         stripe.paymentIntents.retrieve(
          event.data.object.id,
          function(err, paymentIntent) {
              if (err) {
                  console.error("Error al recuperar la información del pago:", err);
                  // Maneja el error de alguna manera adecuada
              } else {
                  console.log("Información del pago:", paymentIntent);
                  
              }
          }
      );
         /* stripe.customers.retrieve(
          event.data.object.customer,
          function(err, customer) {
              if (err) {
                  console.error("Error al recuperar la información del cliente:", err);
                  // Maneja el error de alguna manera adecuada
              } else {
                  console.log("Información del cliente:", customer);
                  // Aquí puedes acceder a toda la información del cliente
                  resData = customer;
              }
          }
      ); */
        break;
      case "customer.created":
        customer = event.data.object
        break
      case "customer.subscription.created":
        const subscription = event.data.object;
        subId = subscription.id; 
        subPlanId = subscription.plan.id

        break;
      case 'checkout.session.completed':
       /*  resData = event.data.object */
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

;

 /*    return response.status(200).send(resData); */
  }
);

export default app;