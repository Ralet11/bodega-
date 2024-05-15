import { Op } from 'sequelize';
import Order from '../models/order.js';
import User from '../models/user.js';
import { getIo } from '../socket.js';
import Local from '../models/local.js';

export const getByLocalId = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findAll({
      where: {
        local_id: id
      }
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const acceptOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.update({ status: 'accepted' });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit('changeOrderState', { status: 'accepted' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al aceptar el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const sendOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await order.update({ status: 'sending' });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit('changeOrderState', { status: 'sending' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al enviar el pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const createOrder = async (req, res) => {
  const { delivery_fee, total_price, oder_details, local_id, status, date_time, type } = req.body;
  const {userId} = req.user
  const io = getIo()
  const users_id = userId

  console.log(oder_details, "order details")

  try {
    const newOrder = await Order.create({
      delivery_fee,
      total_price,
      order_details: oder_details,
      local_id: 1,
      users_id,
      status,
      date_time,
      type
    });

    // Emitir evento de nuevo pedido a través de Socket.IO
    io.emit('newOrder', { oder_details, local_id, users_id, status, date_time, newOrderId: newOrder.id, type });

    res.status(201).json({ message: 'Pedido creado exitosamente' });
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

    await order.update({ status: 'finished' });

    // Emitir evento de finalización de pedido a través de Socket.IO
    io.emit('finishOrder', { id });

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
