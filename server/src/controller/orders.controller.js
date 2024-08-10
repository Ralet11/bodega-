import { Op } from 'sequelize';
import Order from '../models/order.js';
import User from '../models/user.js';
import { getIo } from '../socket.js';
import Local from '../models/local.js';
import DistOrder from '../models/distOrders.model.js';
import cryptoRandomString from 'crypto-random-string';


export const getByLocalId = async (req, res) => {
  console.log("122")
  const { id } = req.params; // Asume que el ID del local se pasa como parámetro de la URL
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado

  try {
    // Buscar el local para verificar el clientId
    const local = await Local.findByPk(id);

    if (!local) {
      console.log("1")
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
  console.log("Esto es el id: ", id)

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
  const { delivery_fee, total_price, oder_details, local_id, status, date_time, type, pi, savings, deliveryAddress } = req.body;
  const id = req.user.userId;
  const io = getIo();
  const users_id = id;

  // Generar el código alfanumérico de 6 dígitos
  const code = cryptoRandomString({length: 6, type: 'alphanumeric'});

  console.log(local_id, "local");

  try {
    const newOrder = await Order.create({
      delivery_fee,
      total_price,
      order_details: oder_details,
      local_id,
      users_id,
      status,
      date_time,
      type,
      pi,
      code,
      deliveryAddress
    });

    // Actualizar el savings del usuario
    const user = await User.findByPk(id);
    if (user) {
      user.savings += savings; // Asumiendo que savings se suma al valor actual
      await user.save();
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Emitir evento de nuevo pedido a través de Socket.IO
    io.emit('newOrder', { oder_details, local_id, users_id, status, date_time, newOrderId: newOrder.id, type, pi, code });

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
  console.log("1")
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
  console.log(req.body, "body")
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