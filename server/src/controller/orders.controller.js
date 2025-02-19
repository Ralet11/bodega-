import db from '../models/index.js';
const { Order, User, Local, Client, Promotion, UserPromotions} = db;

;
import { getIo } from '../socket.js';

// Removemos la importación de DistOrder
// import DistOrder from '../models/distOrders.model.js';
import cryptoRandomString from 'crypto-random-string';

import { sendNewOrderEmail } from '../functions/SendNewOrderEmail.js';
;

export const getByLocalId = async (req, res) => {

  const { id } = req.params; // Asume que el ID del local se pasa como parámetro de la URL
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado

  try {
    // Buscar el local para verificar el clientId
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Obtener las órdenes relacionadas con el local
    const orders = await Order.findAll({
      where: {
        local_id: id,
      },
    });

    // Calcular métricas de ventas, contribución y cantidad de órdenes
    const sales = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    const contribution = sales * 0.1; // Ejemplo: 10% de las ventas como contribución
    const ordersCount = orders.length;

    res.status(200).json({ orders, sales, contribution, ordersCount });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getByLocalIdAndStatus = async (req, res) => {
  const { id } = req.params; // ID del local como parámetro de la URL
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado

  try {
    // Buscar el local para verificar el clientId
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Obtener las órdenes relacionadas con el local
    const orders = await Order.findAll({
      where: {
        local_id: id,
      },
    });

    // Convertir las órdenes a objetos simples para visualizarlas en el log
    const ordersJSON = orders.map((order) => order.toJSON());
    console.log(`Found ${ordersJSON.length} orders for local_id: ${id}`, ordersJSON);

    // Normalizar tipos para coincidir con lo que espera el frontend
    const dineInOrders = ordersJSON.filter(
      (order) => order.type.toLowerCase() === "order-in"
    );
    const pickupOrders = ordersJSON.filter(
      (order) =>
        order.type.toLowerCase() === "pick-up" || order.type.toLowerCase() === "pickup"
    );

    // Devolver las órdenes estructuradas para el componente
    return res.status(200).json({
      dineIn: dineInOrders,
      pickup: pickupOrders,
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const acceptOrder = async (req, res) => {
  const { id } = req.params;
  const io = getIo();

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "accepted" });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit("changeOrderState", { status: "accepted", orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al aceptar el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const sendOrder = async (req, res) => {
  const { id } = req.params;
  const io = getIo();
  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "sending" });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit("changeOrderState", { status: "sending", orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const createOrder = async (req, res) => {
  const {
    delivery_fee,
    total_price,
    order_details,
    local_id,
    status,
    date_time,
    type,
    pi,
    savings: rawSavings,
    deliveryAddressAndInstructions,
    originalDeliveryFee,
    tip,
    promotionRedemption, // Updated variable for promotion redemption
  } = req.body;

  // Convert savings to number
  const savings = Number(rawSavings);

  const deliveryAddress = deliveryAddressAndInstructions.address;
  const deliveryInstructions = deliveryAddressAndInstructions.instructions;

  const id = req.user.userId;
  const io = getIo();
  const users_id = id;

  try {
    // Verify local exists
    const local = await Local.findOne({ where: { id: local_id } });
    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    // Get the client associated with the local (optional for email)
    const client = await Client.findByPk(local.clients_id);
    if (!client) {
      return res.status(404).json({ message: "Client of the local not found" });
    }

    // Generate a 6-digit numeric code
    const code = cryptoRandomString({ length: 6, type: "numeric" });

    // Create the new order
    const newOrder = await Order.create({
      delivery_fee,
      total_price,
      order_details,
      local_id,
      users_id,
      status,
      date_time,
      type,
      pi,
      code,
      deliveryAddress,
      deliveryInstructions,
    });

    // Find or create UserPromotions record for user and local
    const [userPromotion] = await UserPromotions.findOrCreate({
      where: {
        userId: users_id,
        localId: local_id,
      },
      defaults: {
        purchaseCount: 0,
        rewardCount: 0,
      },
    });

    // Increment purchaseCount
    userPromotion.purchaseCount += 1;
    await userPromotion.save();

    // Handle promotion redemption if applicable
    if (promotionRedemption && Object.keys(promotionRedemption).length > 0) {
      const { productId } = promotionRedemption;

      // Find the promotion for the product and local
      const promotion = await Promotion.findOne({
        where: {
          productId: productId,
          localId: local_id,
        },
      });

      if (!promotion) {
        return res.status(400).json({ message: "Invalid promotion" });
      }

      // Check if user has enough purchaseCount
      if (userPromotion.purchaseCount >= promotion.quantity) {
        // Deduct the required quantity from purchaseCount
        userPromotion.purchaseCount -= promotion.quantity;
        // Increment rewardCount
        userPromotion.rewardCount += 1;
        await userPromotion.save();

        // Adjust order details to include the promotional product at zero price
        // (Assuming you need to handle this in order_details)
      } else {
        return res
          .status(400)
          .json({ message: "Not enough purchases to redeem promotion" });
      }
    }

    // Send a new order email
    sendNewOrderEmail(
      newOrder,
      client.email,
      originalDeliveryFee,
      tip,
      deliveryInstructions
    );

    // Update user's savings
    const user = await User.findByPk(id);
    if (user) {
      user.savings += savings;
      await user.save();
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    // Emit new order event via Socket.IO
    io.emit(`newOrder`, {
      order_details,
      local_id,
      users_id,
      status,
      date_time,
      newOrderId: newOrder.id,
      type,
      pi,
      code,
    });

    res.status(201).json({
      message: "Order created successfully",
      newOrder,
      userUpdate: user,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const finishOrder = async (req, res) => {
  const { id } = req.params;
  const io = getIo();
  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "finished", orderId: id });

    // Emitir evento de finalización de pedido a través de Socket.IO
    io.emit("changeOrderState", { status: "finished", orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getOrdersByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const orders = await Order.findAll({
      where: {
        users_id: id,
      },
      include: [
        { model: Local, as: "local", attributes: ["id", "name", "logo", "address"] },
      ],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: Local, as: "local", attributes: ["id", "name", "logo", "address"] },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectOrder = async (req, res) => {
  const { id } = req.body;
  const io = getIo();

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "rejected", orderId: id });

    // Emitir evento de finalización de pedido a través de Socket.IO
    io.emit("changeOrderState", { status: "rejected", orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const acceptOrderByEmail = async (req, res) => {
  const { id } = req.params;
  const io = getIo();

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res
        .status(404)
        .send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; text-align: center; }
              .container { max-width: 600px; margin: auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
              .error { color: red; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="error">Order Not Found</h1>
              <p>The order with ID ${id} could not be found.</p>
            </div>
          </body>
          </html>
        `);
    }

    await order.update({ status: "accepted" });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit("changeOrderState", { status: "accepted", orderId: id });

    return res
      .status(200)
      .send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Accepted</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; text-align: center; }
            .container { max-width: 600px; margin: auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .success { color: green; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">Order Accepted</h1>
            <p>The order with ID ${id} has been successfully accepted.</p>
          </div>
        </body>
        </html>
      `);
  } catch (error) {
    console.error("Error al aceptar el pedido:", error);
    return res
      .status(500)
      .send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Server Error</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; text-align: center; }
            .container { max-width: 600px; margin: auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .error { color: red; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">Server Error</h1>
            <p>There was an error processing your request. Please try again later.</p>
          </div>
        </body>
        </html>
      `);
  }
};

export const cancelOrder = async (req, res) => {
  const id = req.params.id;
  const io = getIo();
  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "cancelled" });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit("changeOrderState", { status: "cancelled", orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al cancelar el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
