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
  const { id } = req.params; // id de la orden
  const userId = req.user.userId; // id del usuario para el room
  const io = getIo();

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "accepted" });

    // Emitir evento solo al room identificado con userId
    io.to(order.users_id).emit("changeOrderState", { status: "accepted", orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al aceptar el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const sendOrder = async (req, res) => {
  const { id } = req.params; // id de la orden
  const userId = req.user.userId; // id del usuario para el room
  const io = getIo();

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "sending" });

    // Emitir evento solo al room identificado con userId
    io.to(order.users_id).emit("changeOrderState", { status: "sending", orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const createOrder = async (req, res) => {
  const {
    total_price,
    order_details,
    local_id,
    status,
    date_time,
    type,
    pi,
    savings: rawSavings,
    promotionRedemption, // Variable para redención de promoción
  } = req.body;

  // Parsear rawSavings y asignar 0 si no es un número válido
  const parsedSavings = Number(rawSavings);
  const savings = isNaN(parsedSavings) ? 0 : parsedSavings;

  const id = req.user.userId;
  const io = getIo();
  const users_id = id;

  try {
    // Verificar que el local existe
    const local = await Local.findOne({ where: { id: local_id } });
    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    // Obtener el cliente asociado al local (opcional para email)
    const client = await Client.findByPk(local.clients_id);
    if (!client) {
      return res.status(404).json({ message: "Client of the local not found" });
    }

    // Generar un código numérico de 6 dígitos
    const code = cryptoRandomString({ length: 6, type: "numeric" });

    // Crear el nuevo pedido sin lógica de delivery
    const newOrder = await Order.create({
      total_price,
      order_details,
      local_id,
      users_id,
      status,
      date_time,
      type,
      pi,
      code,
    });

    // Buscar o crear el registro de UserPromotions para el usuario y el local
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

    // Incrementar purchaseCount
    userPromotion.purchaseCount += 1;
    await userPromotion.save();

    // Manejar la redención de promoción si aplica
    if (promotionRedemption && Object.keys(promotionRedemption).length > 0) {
      const { productId } = promotionRedemption;

      // Buscar la promoción para el producto y local
      const promotion = await Promotion.findOne({
        where: {
          productId: productId,
          localId: local_id,
        },
      });

      if (!promotion) {
        return res.status(400).json({ message: "Invalid promotion" });
      }

      // Verificar si el usuario tiene suficientes compras
      if (userPromotion.purchaseCount >= promotion.quantity) {
        // Deducir la cantidad requerida de purchaseCount
        userPromotion.purchaseCount -= promotion.quantity;
        // Incrementar rewardCount
        userPromotion.rewardCount += 1;
        await userPromotion.save();

        // Ajustar los detalles del pedido para incluir el producto promocional a precio cero
        // (Se asume que se maneja en order_details)
      } else {
        return res
          .status(400)
          .json({ message: "Not enough purchases to redeem promotion" });
      }
    }

    // Enviar un email de nuevo pedido
    sendNewOrderEmail(newOrder, client.email);

    // Actualizar los ahorros del usuario
    const user = await User.findByPk(id);
    if (user) {
      console.log(savings, "savings");
      console.log(user.savings);
      // Solo se suma si savings es un número válido; de lo contrario, se suma 0
      if (!isNaN(savings)) {
        user.savings += savings;
      }
      console.log(user.savings);
      await user.save();
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    // Emitir el evento de nuevo pedido vía Socket.IO
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
  const { id } = req.params; // id de la orden
  const userId = req.user.userId; // id del usuario para el room
  const io = getIo();

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await order.update({ status: "finished", orderId: id });

    // Emitir evento solo al room identificado con userId
    io.to(order.users_id).emit("changeOrderState", { status: "finished", orderId: id });

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
