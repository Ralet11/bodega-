import jwt from "jsonwebtoken";
import Local from '../models/local.js';
import { Op } from 'sequelize';
import Client from "../models/client.js";
import Category from "../models/category.js";
import Product from "../models/product.js";
import nodemailer from 'nodemailer';
import Extra from "../models/extra.js"; 
import ExtraOption from "../models/extraOption.model.js";
import ShopOpenHours from "../models/shopOpenHoursModel.js";
import Discount from "../models/discount.js";
import { getIo } from '../socket.js';
import LocalTag from "../models/localTag.model.js";
import Tag from "../models/tag.model.js";

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



    const locals = await Local.findAll({
      where: {
        clients_id: clientId
      }
    });

    res.status(200).json({ locals, finded: "ok" });
  } catch (error) {
    console.error('Error al obtener locales por cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getById = async (req, res) => {
  const id = req.params.id;
  console.log("trayendo aqui")
  try {
    const local = await Local.findOne({
      where: {
        id: id
      },
     include: [
        {
          model: ShopOpenHours,
          as: 'openingHours'
        },
        {
          model: Discount,
          as: 'discounts',
          where: {
            delivery: 0,
            active: true // Solo descuentos activos
          },
          required: true // Solo traer locales que tengan descuentos activos
        },
        {
          model: Tag,  // Incluye las tags asociadas al local
          as: 'tags',
          attributes: ['id', 'name', 'emoji', 'img'], // Incluir explícitamente los campos que necesitas, incluyendo 'emoji'
          through: { attributes: [] }  // No incluimos los atributos de LocalTag
        }
      ]
    });

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }
   
    console.log(local, "local")
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
  const { id } = req.params;
  const { name, phone, category, address, lat, lng, status, Delivery, pickUp, orderIn, tags } = req.body; // Asegúrate de que las tags vengan en el body
  const { clientId } = req.user;

  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Actualizar los campos del local
    await local.update({
      name,
      phone,
      locals_categories_id: category,
      address,
      lat,
      lng,
      status,
      delivery: Delivery,    // Actualiza el campo de delivery
      pickUp,      // Actualiza el campo de pickUp
      orderIn      // Actualiza el campo de orderIn
    });

    // Actualizar las tags asociadas al local
    if (tags && tags.length > 0) {
      // Limpiar todas las relaciones previas entre el local y sus tags
      await LocalTag.destroy({
        where: {
          local_id: local.id
        }
      });

      // Crear nuevas relaciones entre el local y las tags
      const localTagData = tags.map(tagId => ({
        local_id: local.id,
        tag_id: tagId
      }));
      await LocalTag.bulkCreate(localTagData);
    }

    // Obtener todos los locales del cliente actualizado
    const locals = await Local.findAll({
      where: {
        clients_id: clientId
      },
      include: [{ model: Tag, as: 'tags' }] // Incluir las tags en la respuesta
    });

    res.status(200).json({ message: 'Información del local actualizada exitosamente', locals });
  } catch (error) {
    console.error('Error al actualizar información del local:', error);
    res.status(500).json({ message: 'Error al actualizar información del local' });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address, lat, lng } = req.body;
 

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

  try {

    const locals = await Local.findAll();
  
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
      locals_categories_id: category,
      clients_id: clientId
    });

    // Crear entradas iniciales en ShopOpenHours para cada día de la semana
    const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const openHourEntries = daysOfWeek.map(day => ({
      local_id: newShop.id,
      day: day,
      open_hour: "00:00:00",  // Hora de apertura inicial
      close_hour: "00:00:00"  // Hora de cierre inicial
    }));

    await ShopOpenHours.bulkCreate(openHourEntries);

    // Obtener la tienda recién creada junto con los horarios
    const shop = await Local.findOne({
      where: {
        id: newShop.id
      },
      include: {
        model: ShopOpenHours,
        as: 'openingHours'
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
  const localId = req.params.localId;

  try {
    const categories = await Category.findAll({
      where: { local_id: localId, state: '1' }
    });

    const formattedData = await Promise.all(categories.map(async category => {
      const products = await Product.findAll({
        where: {
          categories_id: category.id,
          state: '1'  // Asegúrate de que state sea un número
        },
        include: [
          {
            model: Extra,
            as: 'extras',
            include: {
              model: ExtraOption,
              as: 'options'
            },
            through: { attributes: [] }
          }
        ]
      });

      return {
        id: category.id,
        name: category.name,
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price.toFixed(2),  // Corrección en la interpolación de la variable price
          description: product.description,
          image: product.img,
          extras: product.extras.map(extra => ({
            id: extra.id,
            name: extra.name,
            options: extra.options.map(option => ({
              name: option.name,
              price: option.price
            })),
            required: extra.required
          }))
        }))
      };
    }));

    res.status(200).json({ categories: formattedData });
  } catch (error) {
    console.error('Error fetching local data:', error);
    res.status(500).json(error);
  }
};


const groupShopsByCategory = (shops) => {

  return shops.reduce((acc, shop) => {
    const categoryId = shop.dataValues.locals_categories_id;
    if (!acc[`${categoryId}`]) {
      acc[`${categoryId}`] = [];
    }
    acc[`${categoryId}`].push(shop.dataValues);
    return acc;
  }, {});
};

export const getShopsOrderByCat = async (req, res) => {
  try {
    const shops = await Local.findAll({
      where: {
        status: '2',
        locals_categories_id: {
          [Op.notIn]: [1, 2]
        }
      },
      include: [
        {
          model: ShopOpenHours,
          as: 'openingHours'
        },
        {
          model: Discount,
          as: 'discounts',
          where: {
            delivery: 0,
            active: true // Solo descuentos activos
          },
          required: true // Solo traer locales que tengan descuentos activos
        },
        {
          model: Tag,  // Incluye las tags asociadas al local
          as: 'tags',
          attributes: ['id', 'name', 'emoji', 'img'], // Incluir explícitamente los campos que necesitas, incluyendo 'emoji'
          through: { attributes: [] }  // No incluimos los atributos de LocalTag
        }
      ]
    });

    const groupedShops = groupShopsByCategory(shops);

    res.json(groupedShops);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
}
export const getShopsByClientId = async (req, res) => {
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

    const locals = await Local.findAll({
      where: {
        clients_id: clientId
      },
      include: [
        {
          model: ShopOpenHours,
          as: 'openingHours', // Asegúrate de que el alias coincida con el definido en la relación
          attributes: ['day', 'open_hour', 'close_hour'] // Atributos que deseas incluir
        }
      ]
    });

    res.status(200).json({ locals, finded: "ok" });
  } catch (error) {
    console.error('Error al obtener locales por cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const changeRating = async (req, res) => {
  const { rating, id } = req.body;

 

  if (rating < 0.00 || rating > 5.00) {
    return res.status(400).json({ message: 'Invalid rating value. It must be between 0.00 and 5.00.' });
  }

  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local not found' });
    }

    // Asegurarse de que ratingSum y ratingCount no sean undefined
    const currentRatingSum = local.ratingSum || 0;
    const currentRatingCount = local.ratingCount || 0;

    // Actualizar la suma de calificaciones y el conteo
    const newRatingSum = currentRatingSum + rating;
    const newRatingCount = currentRatingCount + 1;

   

    // Calcular el nuevo promedio
    const newRating = newRatingSum / newRatingCount;
 

    // Actualizar el local con los nuevos valores
    await local.update({ rating: newRating, ratingSum: newRatingSum, ratingCount: newRatingCount });

    res.status(200).json({ message: 'Rating updated successfully', newRating });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const addService = async (req, res) => {
  const { id } = req.params;
  const { serviceToAdd } = req.body;

  

  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Actualizar el campo correspondiente basado en el servicio a agregar
    if (serviceToAdd === "0") {
      local.pickUp = true;
    } else if (serviceToAdd === "1") {
      local.delivery = true;
    } else if (serviceToAdd === "2") {
      local.orderIn = true;
    } else {
      return res.status(400).json({ message: 'Formato de servicio a agregar inválido.' });
    }

    await local.save();

    // Volver a buscar el local actualizado desde la base de datos
    const localActualizado = await Local.findByPk(id);

    if (localActualizado) {
     
      res.status(200).json({ message: 'Servicio agregado exitosamente', local: localActualizado });
    } else {
      res.status(500).json({ message: 'No se pudo recuperar el local actualizado.' });
    }

  } catch (error) {
    console.error('Error al agregar servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const removeService = async (req, res) => {
  const { id } = req.params;
  const { serviceToRemove } = req.body;



  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Actualizar el campo correspondiente basado en el servicio a eliminar
    if (serviceToRemove === "0") {
      local.pickUp = false;
    } else if (serviceToRemove === "1") {
      local.delivery = false;
    } else if (serviceToRemove === "2") {
      local.orderIn = false;
    } else {
      return res.status(400).json({ message: 'Formato de servicio a eliminar inválido.' });
    }

    await local.save();

    // Volver a buscar el local actualizado desde la base de datos
    const localActualizado = await Local.findByPk(id);

    if (localActualizado) {
  
      res.status(200).json({ message: 'Servicio eliminado exitosamente', local: localActualizado });
    } else {
      res.status(500).json({ message: 'No se pudo recuperar el local actualizado.' });
    }

  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "proyectoapptrader@gmail.com",  // Replace with your Gmail address from environment variables
    pass: "eozh tjoi bdod hwiz"  // Replace with your Gmail password or app-specific password from environment variables
  }
});

export const sendCertificate = async (req, res) => {
  const { file } = req;
  const { email, id } = req.body; // Asumiendo que el correo del destinatario viene en el cuerpo de la solicitud
  

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const mailOptions = {
    from: 'proyectoapptrader@gmail.com', // Reemplaza con tu correo electrónico
    to: email,
    subject: 'Certificate',
    text: `Here is the certificate for your shop. Shop number: ${id}`,
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer,
        encoding: 'base64'
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
};

export const updateOpeningHours = async (req, res) => {


  const { localId, openingHours } = req.body; // Suponiendo que estás enviando el localId y el array de openingHours en el body



  try {
    // Buscar el local por ID
    const local = await Local.findByPk(localId);

    // Verificar si el local existe
    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Verificar si el cliente tiene permiso para modificar este local
    if (local.clients_id !== req.user.clientId) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para modificar este local.' });
    }

    // Buscar todas las entradas en ShopOpenHours para este local
    const existingHours = await ShopOpenHours.findAll({
      where: { local_id: localId }
    });

    // Actualizar cada entrada en ShopOpenHours con la nueva información
    const updatePromises = existingHours.map((existingHour) => {
      const updatedHour = openingHours.find((hour) => hour.day === existingHour.day);

      if (updatedHour) {
        return existingHour.update({
          open_hour: updatedHour.open,
          close_hour: updatedHour.close,
        });
      }

      return null;
    });

    // Ejecutar todas las actualizaciones
    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Horarios de apertura actualizados exitosamente' });
  } catch (error) {
    console.error('Error al actualizar horarios de apertura:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOpeningHoursByLocalId = async (req, res) => {

  const { localId } = req.body;

  try {
    // Buscar el local por ID
    const local = await Local.findByPk(localId);

    // Verificar si el local existe
    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Verificar si el cliente tiene permiso para acceder a este local
    if (local.clients_id !== req.user.clientId) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para ver los horarios de este local.' });
    }

    // Obtener los horarios de apertura por localId
    const openingHours = await ShopOpenHours.findAll({
      where: { local_id: localId }
    });

    // Verificar si se encontraron horarios
    if (openingHours.length === 0) {
      return res.status(404).json({ message: 'No se encontraron horarios para este local.' });
    }

    res.status(200).json(openingHours);
  } catch (error) {
    console.error('Error al obtener horarios de apertura:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getShopsOrderByCatDiscount = async (req, res) => {
  try {
    const shops = await Local.findAll({
      where: {
        status: '2',
        orderIn: true,
        locals_categories_id: {
          [Op.notIn]: [1, 2]
        }
      },
      include: [
        {
          model: ShopOpenHours,
          as: 'openingHours'
        },
        {
          model: Discount,
          as: 'discounts',
          where: {
            delivery: 0,
            active: true // Solo descuentos activos
          },
          required: true // Solo traer locales que tengan descuentos activos
        },
        {
          model: Tag,  // Incluye las tags asociadas al local
          as: 'tags',
          attributes: ['id', 'name', 'emoji', 'img'], // Incluir explícitamente los campos que necesitas, incluyendo 'emoji'
          through: { attributes: [] }  // No incluimos los atributos de LocalTag
        }
      ]
    });

    const groupedShops = groupShopsByCategory(shops);
    console.log(groupedShops, 'groupedShops');
  
    res.json(groupedShops);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

export const syncLocal = async (req, res) => { 
  const io = getIo();
  
  try {
    io.emit('syncShops');
    res.status(200).json({ message: 'Success sync' });  // Usa 'res' en lugar de 'req'
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });  // Usa 'res' en lugar de 'req'
  }
}