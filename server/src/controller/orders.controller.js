import { Op } from 'sequelize';
import Order from '../models/order.js';
import User from '../models/user.js';
import { getIo } from '../socket.js';
import Local from '../models/local.js';
import DistOrder from '../models/distOrders.model.js';
import cryptoRandomString from 'crypto-random-string';
import Client from '../models/client.js';
import { sendNewOrderEmail } from '../functions/SendNewOrderEmail.js';
import Promotion from '../models/Promotions.model.js';
import UserPromotions from '../models/UserPromotion.model.js';


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
        local_id: id
      }
    });

    // Calcular métricas de ventas, contribución y cantidad de órdenes
    const sales = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    const contribution = sales * 0.1; // Ejemplo: 10% de las ventas como contribución
    const ordersCount = orders.length;

    res.status(200).json({ orders, sales, contribution, ordersCount });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const acceptOrder = async (req, res) => {
  const { id } = req.params;
  const io = getIo()


  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.update({ status: 'accepted' });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit('changeOrderState', { status: 'accepted', orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al aceptar el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const sendOrder = async (req, res) => {
  const { id } = req.params;
  const io = getIo()
  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.update({ status: 'sending' });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit('changeOrderState', { status: 'sending', orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al enviar el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
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
    savings,
    deliveryAddressAndInstructions,
    originalDeliveryFee,
    tip,
    promotion // Añadimos la variable 'promotion' al destructuring de req.body
  } = req.body;

  const deliveryAddress = deliveryAddressAndInstructions.address;
  const deliveryInstructions = deliveryAddressAndInstructions.instructions;

  const id = req.user.userId;
  const io = getIo();
  const users_id = id;

  try {
    // Verificar si el local existe
    const local = await Local.findOne({ where: { id: local_id } });
    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Obtener el cliente al que pertenece el local (opcional para envío de email)
    const client = await Client.findByPk(local.clients_id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente del local no encontrado' });
    }

    // Generar el código alfanumérico de 6 dígitos
    const code = cryptoRandomString({ length: 6, type: 'numeric' });

    // Crear la nueva orden
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
      deliveryInstructions
    });

    // Verificar si el local tiene promociones activas
    const promotions = await Promotion.findAll({ where: { localId: local_id } });

    for (const promotion of promotions) {
      // Verificar si el usuario ya tiene esta promoción en su lista de promociones activas
      let userPromotion = await UserPromotions.findOne({
        where: {
          userId: users_id,
          promotionId: promotion.id
        }
      });

      if (!userPromotion) {
        // Si el usuario no tiene esta promoción, crear una nueva entrada
        userPromotion = await UserPromotions.create({
          userId: users_id,
          promotionId: promotion.id,
          purchaseCount: 1 // Iniciar el conteo en 1 porque ya realizó una compra
        });
      } else {
        // Si ya tiene la promoción, incrementar el conteo de compras
        userPromotion.purchaseCount += 1;

        // Verificar si alcanza la cantidad necesaria para recibir el producto gratis
        if (userPromotion.purchaseCount >= promotion.quantity && !userPromotion.rewardReceived) {
          userPromotion.rewardReceived = true;
          // Aquí puedes implementar la lógica para notificar al usuario
          // que ha alcanzado la promoción, o agregar el producto gratis a su cuenta.
        }

        // Guardar los cambios en la tabla de UserPromotions
        await userPromotion.save();
      }
    }

    // Si llega 'promotion: true', reiniciar la promoción
    if (promotion === true) {
      // Buscar todas las promociones activas del usuario para el local actual
      const userPromotionsToReset = await UserPromotions.findAll({
        where: {
          userId: users_id,
          promotionId: promotions.map(promo => promo.id) // Filtra solo las promociones del local actual
        }
      });

      // Reiniciar el conteo de compras para todas las promociones del local
      for (const userPromo of userPromotionsToReset) {
        userPromo.purchaseCount = 0; // Resetea el conteo
        userPromo.rewardReceived = false; // Resetea el estado de 'rewardReceived'
        await userPromo.save(); // Guarda los cambios
      }
    }

    // Enviar un email de nueva orden
    sendNewOrderEmail(newOrder, client.email, originalDeliveryFee, tip, deliveryInstructions);

    // Actualizar el savings del usuario
    const user = await User.findByPk(id);
    if (user) {
      user.savings += savings; // Asumiendo que savings se suma al valor actual
      await user.save();
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Emitir evento de nuevo pedido a través de Socket.IO
    io.emit(`newOrder`, {
      order_details,
      local_id,
      users_id,
      status,
      date_time,
      newOrderId: newOrder.id,
      type,
      pi,
      code
    });

    res.status(201).json({ message: 'Pedido creado exitosamente', newOrder, userUpdate: user });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const getOrderUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const finishOrder = async (req, res) => {
  const { id } = req.params;
  const io = getIo()
  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.update({ status: 'finished', orderId: id });

    // Emitir evento de finalización de pedido a través de Socket.IO

    io.emit('changeOrderState', { status: 'finished', orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al finalizar el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getOrdersByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const orders = await Order.findAll({
      where: {
        users_id: id
      },
      include: [
        { model: Local, as: 'local', attributes: ['id', 'name', 'img', 'address'] }
      ]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getByOrderId = async (req, res) => {

  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: Local, as: 'local', attributes: ['id', 'name', 'img', 'address'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectOrder = async (req, res) => {
  const { id } = req.body;
  const io = getIo()

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.update({ status: 'rejected', orderId: id });

    // Emitir evento de finalización de pedido a través de Socket.IO

    io.emit('changeOrderState', { status: 'rejected', orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al finalizar el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const acceptOrderByEmail = async (req, res) => {
  const { id } = req.params;
  const io = getIo();


  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).send(`
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

    await order.update({ status: 'accepted' });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit('changeOrderState', { status: 'accepted', orderId: id });


    return res.status(200).send(`
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
    console.error('Error al aceptar el pedido:', error);
    return res.status(500).send(`
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
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.update({ status: 'cancelled' });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit('changeOrderState', { status: 'cancelled', orderId: id });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al cancelar el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }

}