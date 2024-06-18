import twilio from 'twilio';
import { TWILIO_PHONE_NUMBER } from '../config.js';
import Order from '../models/order.js';
import { getIo } from '../socket.js';

const accountSid = 'AC0905023d05304d16ef0f446444e8ac9a'; // Reemplaza con tu Account SID
const authToken = '363bc7637f8dd2c587799f50ef134710'; // Reemplaza con tu Auth Token
const client = twilio(accountSid, authToken);

export const makeCall = (req, res) => {
  const { to, orderId } = req.body;

  client.calls
    .create({
      url: `https://aae0-190-7-248-15.ngrok-free.app/api/twilio/voice?orderId=${orderId}`,
      to: to,
      from: '+12295973706',
    })
    .then(call => res.json({ callSid: call.sid }))
    .catch(error => {
      res.status(500).json({ error: error.message })
      console.log(error)
    });
};

export const voiceResponse = (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  const orderId = req.query.orderId;

  response.say('You have a new order from Bodega. To accept it, press 1. To reject it, press 2.', { voice: 'alice', language: 'en-US' });

  response.gather({
    numDigits: 1,
    action: `https://aae0-190-7-248-15.ngrok-free.app/api/twilio/handle-key?orderId=${orderId}`,
    method: 'POST',
  });

  res.type('text/xml');
  res.send(response.toString());
};

const updateOrderStatus = async (id, status) => {
  const io = getIo();

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      throw new Error('Order not found');
    }

    await order.update({ status });

    // Emitir evento de cambio de estado del pedido a través de Socket.IO
    io.emit('changeOrderState', { id, status });

    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const handleKeyPress = async (req, res) => {
  const digit = req.body.Digits;
  const orderId = req.query.orderId;
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  try {
    if (digit === '1') {
      await updateOrderStatus(orderId, 'accepted');
      response.say('You have accepted the order.', { voice: 'alice', language: 'en-US' });
      console.log(`Order ${orderId} accepted`);
    } else if (digit === '2') {
      await updateOrderStatus(orderId, 'rejected');
      response.say('You have rejected the order.', { voice: 'alice', language: 'en-US' });
      console.log(`Order ${orderId} rejected`);
    } else {
      response.say('Invalid input.', { voice: 'alice', language: 'en-US' });
    }

    res.type('text/xml');
    res.send(response.toString());
  } catch (error) {
    console.error('Error handling key press:', error);
    response.say('An error occurred while processing your request.', { voice: 'alice', language: 'en-US' });
    res.type('text/xml');
    res.send(response.toString());
  }
};