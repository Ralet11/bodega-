import express from "express";
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

export default server;
