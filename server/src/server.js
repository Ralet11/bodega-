


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
import DistOrder from "./models/distOrders.model.js";
import DistOrderProduct from "./models/distOrderProduct.model.js";
import DistProduct from "./models/distProducts.model.js";
import { sendEmailWithProducts } from "./functions/sendEmail.js";
import Client from "./models/client.js";
import Local from "./models/local.js";
import Distributor from "./models/distributor.model.js";
import { createDistributor } from "./controller/distributor.controller.js";
import clientRouter from "./routes/client.routes.js";
import contactRouter from "./routes/contact.routes.js";
import balanceRequestRouter from "./routes/balanceRequest.routes.js";
import subcategoriesRouter from './routes/subcategories.routes.js'
import brandsRouter from './routes/brands.routes.js'



const app = express();
const stripe = new Stripe(SSK);

const endpointSecret = "whsec_9d9dffedc83b18c6cb3f360a0332c541e2f9a2362d625d1968196a540566d3d6"


//

// Middleware de logging
app.use(morgan("dev"));

// Configuración de CORS
const corsOptions = {
  origin: [`${FRONTEND_URL}`, "exp://192.168.75.227:8081"],
};
app.use(cors(corsOptions));

// Ruta del webhook de Stripe antes de los otros middleware


app.post("/webhook", express.raw({ type: "application/json" }), async (request, response) => {
  const sig = request.headers["stripe-signature"];
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderData;
      console.log("Esto es order id: ", orderId);
      console.log("Esto es paymentIntent.metadata: ", paymentIntent.metadata);

      // Analizar providerIds desde JSON a array
      let supplierIds;
      try {
        supplierIds = JSON.parse(paymentIntent.metadata.providerIds);
        console.log("Esto es supplier id: ", supplierIds);
      } catch (error) {
        console.error(`Error parsing supplierIds: ${error.message}`);
        return response.status(400).send(`Error parsing supplierIds: ${error.message}`);
      }

      try {
        const order = await DistOrderProduct.findAll({
          where: {
            order_id: orderId
          },
          include: [
            {
              model: DistProduct
            }
          ]
        });
        
        if (!order) {
          console.error(`Order with ID ${orderId} not found.`);
          return response.status(404).send(`Order with ID ${orderId} not found.`);
        }

        // Crear un nuevo array con la información específica de cada producto
        const productDetails = order.map(item => ({
          id: item.DistProduct.id,
          name: item.DistProduct.name,
          id_proveedor: item.DistProduct.id_proveedor,
          quantity: item.quantity,
          price: item.DistProduct.price
        }));

        const suppliers = await Distributor.findAll({
          where: {
            id: supplierIds
          },
          include: [
            {
              model: DistProduct
            }
          ]
        });

        const supplierData = suppliers.map(supplier => ({
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address
        }));

        console.log("Product details:", JSON.stringify(productDetails, null, 2));
      
        const client = await Client.findByPk(paymentIntent.metadata.customer);
        const local = await Local.findByPk(paymentIntent.metadata.localData);
        
        const clientData = {
          name: client.name,
          id: client.id,
          phone: client.phone
        };

        const localData = {
          name: local.name,
          address: local.address,
          phone: local.phone,
          id: local.id
        };

        // Llamar a la función para enviar el email
        const emailResult = await sendEmailWithProducts(productDetails, clientData, localData, supplierData);
        console.log(emailResult);

        // Aquí puedes agregar cualquier lógica adicional, como actualizar el estado de la orden, enviar correos electrónicos, etc.

      } catch (error) {
        console.error(`Error fetching order: ${error.message}`);
        return response.status(500).send(`Error fetching order: ${error.message}`);
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.status(200).send();
});


// Middleware general para otras rutas
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

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
app.use("/api/distributors", createDistributor);
app.use('/api/clients', clientRouter)
app.use('/api/contact', contactRouter)
app.use('/api/balanceRequest', balanceRequestRouter)
app.use('/api/subcategories', subcategoriesRouter)
app.use('/api/brands', brandsRouter)


export default app;
