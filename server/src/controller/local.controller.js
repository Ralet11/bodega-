import jwt from "jsonwebtoken";
import Local from '../models/local.js';
import { Op } from 'sequelize';
import Client from "../models/client.js";
import Category from "../models/category.js";
import Product from "../models/product.js";

export const getByClientId = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    const decoded = jwt.verify(tokenParts[1], 'secret_key');

    if (!decoded || !decoded.clientId) {
      return res.status(403).json({ message: 'Token inválido o falta el ID del cliente.' });
    }

    const clientId = decoded.clientId;

    console.log(clientId, "id ")

    const locals = await Local.findAll({
      where: {
        clients_id: clientId
      }
    });

    res.status(200).json({locals, finded: "ok"});
  } catch (error) {
    console.error('Error al obtener locales por cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getById = async (req, res) => {
  const id = req.params.id;

  try {
    const local = await Local.findOne({
      where: {
        id: id
      }
    });

    console.log(local)

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    res.status(200).json(local);
  } catch (error) {
    console.error('Error al obtener local por ID:', error);
    res.status(500).send(error.message);
  }
};

export const changeStatus = async (req, res) => {
  const id = req.params.id;
  const { newStatus } = req.body;

  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    await local.update({ status: newStatus });

    res.status(200).json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al cambiar estado del local:', error);
    res.status(500).send(error.message);
  }
};

export const updateShop = async (req, res) => {
  const { id, name, phone, category } = req.body;

  const cat = String(category)
  console.log(cat)

  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    await local.update({ name, phone, locals_categories_id: cat });

    res.status(200).json({ message: 'Información del local actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar información del local:', error);
    res.status(500).json({ message: 'Error al actualizar información del local' });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address, lat, lng } = req.body;
  console.log(address, "address")

  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    await local.update({ address, lat, lng });

    res.status(200).json({ message: 'Dirección del local actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar dirección del local:', error);
    res.status(500).json({ message: 'Error al actualizar dirección del local' });
  }
};

export const getActiveShops = async (req, res) => {
  const { category } = req.query;

  try {
    let whereClause = {};

    if (category) {
      whereClause.locals_categories_id = category;
    }

    const locals = await Local.findAll({
      where: whereClause
    });

    res.status(200).json(locals);
  } catch (error) {
    console.error('Error al obtener locales activos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAllShops = async (req, res) => {
  console.log("hola")
  try {

    const locals = await Local.findAll();
    console.log(locals)
    res.status(200).json(locals);
  } catch (error) {
    console.error('Error al obtener locales activos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addShop = async (req, res) => {
  try {
    const { name, address, phone, lat, lng, category, clientId } = req.body;

    const idConfirm = req.user.clientId;
    console.log(idConfirm);

    // Verificar que todos los campos estén presentes
    if (!name || !address || !phone || !lat || !lng || !category || !clientId) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    // Verificar que el clientId coincida con el idConfirm
    if (clientId !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Crear la nueva tienda
    const newShop = await Local.create({
      name,
      address,
      phone,
      lat,
      lng,
      category,
      clients_id: clientId
    });

    // Obtener la tienda recién creada
    const shop = await Local.findOne({
      where: {
        id: newShop.id
      }
    });

    res.json({
      error: false,
      created: "ok",
      result: shop,
      message: "Shop added successfully"
    });
  } catch (error) {
    console.error('Error adding shop:', error);
    res.status(500).json({ error: true, message: error.message });
  }
};


export const getLocalCategoriesAndProducts = async (req, res) => {

  const localId = req.params.localId

  try {
    // Obtén todas las categorías que pertenecen al local_id
    const categories = await Category.findAll({
      where: { local_id: localId }
    });

    // Formatea los datos para la estructura deseada
    const formattedData = await Promise.all(categories.map(async category => {
      const products = await Product.findAll({
        where: { categories_id: category.id }
      });

      return {
        id: category.id,
        name: category.name,
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          price: `$${product.price.toFixed(3)}`,
          description: product.description,
          image: product.img,
        }))
      };
    }));

    res.status(200).json({categories: formattedData });
  } catch (error) {
    console.error('Error fetching local data:', error);
    res.status(500).json(error)
  }
};