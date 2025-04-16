import db from '../models/index.js';
import { Op } from 'sequelize';
import { SSK } from '../config.js'; // SSK es tu clave secreta de Stripe
import Stripe from 'stripe'; // Importamos Stripe
const stripe = new Stripe(SSK); // Inicializamos Stripe con tu clave secreta
const { Client, Local, Order } = db;

export const getAffiliatedShops = async (req, res) => {
  try {
    // 1. Obtener el ID del vendedor desde req.user (suponiendo que en el token se guarda en clientId)
    const sellerId = req.user.clientId;

    // 2. Definir el rango de fechas para el mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // 3. Buscar todos los clientes que tengan affiliatedSellerId = sellerId e incluir sus locales (shops)
    //    Además, en cada local, incluir las orders con status 'finalizado' y del mes actual
    const clients = await Client.findAll({
      where: { affiliatedSellerId: sellerId },
      include: [
        {
          model: Local,
          as: 'locals',
          include: [
            {
              model: Order,
              as: 'orders',
              where: {
                status: 'finished',
                date_time: {
                  [Op.gte]: startOfMonth,
                  [Op.lt]: startOfNextMonth
                }
              },
              required: false // Para incluir locales sin orders en el mes actual
            }
          ]
        }
      ]
    });



    // 4. Extraer todos los shops (locals) y calcular el total vendido en el mes actual para cada uno
    const allShops = clients.flatMap(client =>
      client.locals.map(local => {
        const totalSales = local.orders.reduce((acc, order) => {
          // Convertimos total_price a número (asumiendo que viene como string)
          return acc + parseFloat(order.total_price || 0);
        }, 0);

        // Se agrega la propiedad totalSales a los datos del local
        return { ...local.toJSON(), totalSales };
      })
    );

    return res.status(200).json({
      success: true,
      shopsData: allShops
    });
  } catch (error) {
    console.error('Error al obtener los shops afiliados:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al intentar obtener los shops afiliados.'
    });
  }
};

export const createStripeAccount = async (req, res) => {
  try {
    const { email, business_name, country } = req.body;
    // Crear cuenta de Stripe de tipo "express"
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      business_profile: {
        name: business_name
      }
    });
    // Crear enlace de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: process.env.STRIPE_REFRESH_URL, // URL para refrescar el onboarding
      return_url: process.env.STRIPE_RETURN_URL,   // URL a la que regresa el usuario
      type: 'account_onboarding'
    });
    return res.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    return res.status(500).json({ message: "Error creating Stripe account" });
  }
};
