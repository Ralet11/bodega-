import db from '../models/index.js';
const {User, Client, PayMethod, UserBodegaProSubs, Local} = db;

import Stripe from 'stripe';
import { FRONTEND_URL, SSK } from '../config.js';

const stripe = new Stripe(SSK);

export const tryIntent = async (req, res) => {
  const { finalPrice, activeShop } = req.body;

  const shop = await Local.findByPk(activeShop)

console.log(shop, "shop")

   const client = await Client.findByPk(shop.clients_id)

  const connectedAccountId = client.stripe_account_id

  console.log(client, "conect")

  const applicationFee = Math.round(finalPrice * 0.10);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalPrice, // valor en centavos
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: {
        destination: connectedAccountId, // ID de la cuenta conectada de la tienda
      },
      application_fee_amount: applicationFee, // comisión de la plataforma, en centavos
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getPayMethods = async (req, res) => {
  try {
    const payMethods = await PayMethod.findAll();
    res.status(200).json(payMethods);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const addPayMethod = async (req, res) => {
  try {
    const { methods, client } = req.body.data
 

    if (!methods || !client) {
      return res.status(400).json({ success: false, message: 'Datos de solicitud no válidos' });
    }

    const clientInstance = await Client.findByPk(client);

    if (!clientInstance) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    }

    // Actualiza los métodos de pago del cliente
    await clientInstance.update({ pay_methods: JSON.stringify(methods) });

    res.status(200).json({ success: true, message: 'Método de pago agregado correctamente' });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const removePayMethod = async (req, res) => {
  try {
    const { methodId, client } = req.body.data;

    const clientInstance = await Client.findByPk(client);

    if (!clientInstance) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    }

    const methods = JSON.parse(clientInstance.pay_methods);

    // Filtra los métodos de pago del cliente para eliminar el método especificado
    const updatedMethods = methods.filter(method => method !== methodId);

    // Actualiza los métodos de pago del cliente con los métodos actualizados
    await clientInstance.update({ pay_methods: JSON.stringify(updatedMethods) });

    res.status(200).json(updatedMethods);
  } catch (error) {
    console.error('Error al eliminar el método de pago:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createRefund = async (req, res) => {
  const { pi, amount } = req.body;


  if (!pi) {
    return res.status(400).json({ error: 'PaymentIntent ID is required' });
  }

  // Convert the amount to cents
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount provided' });
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: pi,
      amount: amount, // La cantidad a reembolsar en centavos.
    });

 
    res.status(200).json(refund);
  } catch (error) {
    console.error('Error creating refund:', error);
    res.status(500).json({ error: 'Failed to create refund', details: error.message });
  }
};

export const createSubscriptionCheckout = async (req, res) => {
  const { priceId } = req.body;
  const userId = req.user.userId;

  try {
    // Retrieve the user from the database
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a customer in Stripe if not already created
    let customer;
    if (!user.stripeCustomerId) {
      customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });

      // Save the Stripe customer ID in the database
      user.stripeCustomerId = customer.id;
      await user.save();
    } else {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const paymentIntent = subscription.latest_invoice.payment_intent;

    // Create entry in UserBodegaProSubs table
    await UserBodegaProSubs.create({
      user_id: userId,
      subscription_id: subscription.id,
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret, subscriptionId: subscription.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription', details: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Retrieve the user from the database
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve the subscriptionId from UserBodegaProSubs table
    const userSubscription = await UserBodegaProSubs.findOne({
      where: {
        user_id: userId
      }
    });

    if (!userSubscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscriptionId = userSubscription.subscription_id;

    // Cancel the subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    // Remove the subscription from UserBodegaProSubs table
    await UserBodegaProSubs.destroy({
      where: {
        user_id: userId,
        subscription_id: subscriptionId
      }
    });

    // Update the user's subscription status in the database
    user.subscription = 0;
    await user.save();

    res.status(200).json({ message: 'Subscription cancelled successfully', subscription });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription', details: error.message });
  }
};
