
import { Op } from 'sequelize';
import Client from '../models/client.js';
import PayMethod from '../models/pay_method.js';
import Stripe from 'stripe';
import { FRONTEND_URL, SSK } from '../config.js';
import Local from '../models/local.js';
import { sendEmailWithProducts } from '../functions/sendEmail.js';
import Distributor from '../models/distributor.model.js';
import User from '../models/user.js';

const stripe = new Stripe(SSK);

export const tryIntent = async (req, res) => {
  const { finalPrice } = req.body;
  console.log(req.body);



  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalPrice,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });

    console.log(error.message);
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
    const { methods, client } = req.body.data;
    console.log(methods, client);

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

export const checkoutDistPayment = async (req, res) => {
  const { products, customerInfo, orderData, shop } = req.body; // Agregar orderId a la petición
  const { name, email, id, phone} = customerInfo;


  const idConfirm = req.user.clientId

  if (id !== idConfirm) {
    return res.status(403).json({ message: "Forbidden. Client ID does not match." });
  }

  try {

    const local = await Local.findByPk(shop)

    const localData = {
      name: local.name,
      address: local.address,
      phone: local.phone,
      id: local.id
    }

    let customer;

    // Verificar si el cliente ya existe en Stripe
    try {
      customer = await stripe.customers.retrieve(id.toString()); // Convert id to string
    } catch (error) {
      // Si el cliente no existe, crearlo
      if (error.raw && error.raw.code === 'resource_missing') {
        customer = await stripe.customers.create({
          name: name,
          email: email,
          id: id.toString(),
          phone: phone
        });
      } else {
        throw error; // Re-throw error if it's not "resource_missing"
      }
    }

    // Crear la lista de artículos para el pago
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd', // Change to your currency
        product_data: {
          name: product.name
        },
        unit_amount: product.price * 100, // Convert to cents
      },
      quantity: product.quantity || 1 // Si no se especifica la cantidad, se asume 1
    }));

    // Convertir la información de la orden a una cadena JSON
    const orderDataString = JSON.stringify(orderData);
    const uniqueProviderIds = [...new Set(products.map(product => product.id_proveedor))];


    // Crear la sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: lineItems,
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${FRONTEND_URL}/succesPaymentDist`,
      cancel_url: `${FRONTEND_URL}/payment/cancel`,
      payment_intent_data: {
        setup_future_usage: "off_session",
        metadata: {
          orderData: orderDataString,
          customer: customer.id,
          localData: JSON.stringify(localData.id),
          providerIds: JSON.stringify(uniqueProviderIds)
           // Almacenar la información de la orden como una cadena JSON
        }
      }
    });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
}


export const checkoutBodegaDistPayment = async (req, res) => {
  
  const { remainingBalance, clientId, orderData, localId } = req.body;

  const idConfirm = req.user.clientId

  if (clientId !== idConfirm) {
    return res.status(403).json({ message: "Forbidden. Client ID does not match." });
  }

  const productDetails = orderData.map(item => ({
    id: item.DistProduct.id,
    name: item.DistProduct.name,
    id_proveedor: item.DistProduct.id_proveedor,
    quantity: item.quantity,
    price: item.DistProduct.price
}));

// Extraer todos los proveedores únicos
 const uniqueSuppliers = [...new Set(productDetails.map(item => item.id_proveedor))];

 const suppliers = await Distributor.findAll({
  where: {
      id: uniqueSuppliers
  }
})

const supplierData = suppliers.map(supplier => ({
  id: supplier.id,
  name: supplier.name,
  phone: supplier.phone,
  email: supplier.email,
  address: supplier.address
}));

  
  try {
    // Encuentra al cliente por su ID
    const client = await Client.findByPk(clientId);


    // Si el cliente no existe, devuelve un error
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const clientData = {
      name: client.name,
      id: client.id,
      phone: client.phone
    };


    // Actualiza el balance del cliente
    client.balance = remainingBalance;
    await client.save();

    const local = await Local.findByPk(localId);

    const localData = {
      name: local.name,
      address: local.address,
      phone: local.phone,
      id: local.id
    };

    await sendEmailWithProducts(productDetails, clientData, localData, supplierData )
    console.log("email send succesfully")

    // Devuelve una respuesta exitosa
    res.status(200).json({ message: 'Balance actualizado correctamente', client });
  } catch (error) {
    // Maneja los errores
    console.error('Error actualizando el balance del cliente:', error);
    res.status(500).json({ message: 'Error actualizando el balance del cliente', error });
  }
};

export const createRefund = async (req, res) => {
  const { pi, amount } = req.body;
  console.log(amount, "amoutn")

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

    console.log('Refund successful:', refund);
    res.status(200).json(refund);
  } catch (error) {
    console.error('Error creating refund:', error);
    res.status(500).json({ error: 'Failed to create refund', details: error.message });
  }
};