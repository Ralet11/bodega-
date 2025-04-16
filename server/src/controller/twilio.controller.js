import db from '../models/index.js';
const {Order} = db;


import twilio from 'twilio';

import { getIo } from '../socket.js';
import { ACCOUNT_SID, AUTH_TOKEN } from '../config.js';

const accountSid =  ACCOUNT_SID; 
const authToken =  AUTH_TOKEN; 
const client = twilio(accountSid, authToken);

export const makeCall = (req, res) => {

  const { to } = req.body;
  const orderId = req.body.orderId.id;

  const ip = 'https://b3a2-190-246-136-112.ngrok-free.app'

   client.calls
    .create({
      url: `${ip}/api/twilio/voice?orderId=${orderId}`,
      to: to,
      from: '+18086384088',
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
  const ip = 'https://3.15.211.38'
  response.say('You have a new order from Bodega. To accept it, press 1. To reject it, press 2.', { voice: 'alice', language: 'en-US' });

  response.gather({
    numDigits: 1,
    action: `${ip}/api/twilio/handle-key?orderId=${orderId}`,
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
     
    } else if (digit === '2') {
      await updateOrderStatus(orderId, 'rejected');
      response.say('You have rejected the order.', { voice: 'alice', language: 'en-US' });
 
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