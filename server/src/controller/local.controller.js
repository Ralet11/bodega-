
import db from '../models/index.js';
const { Local, Category, Product, Extra, ExtraOption, ShopOpenHours, LocalTag, Tag, LocalCategory, ProductSchedule, Client} = db;
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";

import { literal, Op } from 'sequelize';

import { getIo } from '../socket.js';


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
  const {
    name,
    phone,
    category,
    address,
    lat,
    lng,
    status,
    Delivery,
    pickUp,
    orderIn,
    tags,
    owner_check,
    website,
    description,
    einNumber,
  } = req.body;
  const { clientId } = req.user;
console.log(req.body, "body")
  try {
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    // Actualizar campos del local
    await local.update({
      name,
      phone,
      locals_categories_id: category,
      address,
      lat,
      lng,
      status,
      delivery: Delivery,
      pickUp,
      orderIn,
      owner_check,
      website,
      description,
      einNumber
    });

    // Actualizar tags asociadas (siempre que las envíes en el body)
    if (tags && tags.length > 0) {
      // Limpiar relaciones previas local-tag
      await LocalTag.destroy({
        where: {
          local_id: local.id
        }
      });

      // Crear nuevas relaciones
      const localTagData = tags.map(tagId => ({
        local_id: local.id,
        tag_id: tagId
      }));
      await LocalTag.bulkCreate(localTagData);
    }

    // Devolver todos los locales del cliente
    const locals = await Local.findAll({
      where: {
        clients_id: clientId
      },
      include: [{ model: Tag, as: 'tags' }]
    });

    return res.status(200).json({
      message: 'Información del local actualizada exitosamente',
      locals
    });
  } catch (error) {
    console.error('Error al actualizar información del local:', error);
    return res.status(500).json({ message: 'Error al actualizar información del local' });
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

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "00:00:00";
  // Eliminar puntos y poner en minúsculas (por ejemplo, "08:00 a.m." => "08:00 am")
  let t = timeStr.toLowerCase().replace(/\./g, '');
  // Separar la hora y el modificador ("am" o "pm")
  let [time, modifier] = t.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (modifier === "pm" && hours < 12) {
    hours += 12;
  }
  if (modifier === "am" && hours === 12) {
    hours = 0;
  }
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  return `${hoursStr}:${minutesStr}:00`;
};

export const addShop = async (req, res) => {
  console.log(req.body, "body");

  try {
    const {
      storeInfo,
      orderMethod,
      hours,
      menu,
      bankAccount,
      coordinates
    } = req.body;

    if (
      !storeInfo ||
      !storeInfo.name ||
      !storeInfo.address ||
      !storeInfo.phone ||
      !storeInfo.email ||
      !storeInfo.selectedTags ||
      !coordinates?.lat ||
      !coordinates?.lng
    ) {
      return res
        .status(400)
        .json({ message: "Bad Request. Please fill all required fields." });
    }

    // Crear la nueva tienda (Local)
    const newShop = await Local.create({
      name: storeInfo.name,
      address: storeInfo.address,
      phone: storeInfo.phone,
      lat: coordinates.lat,
      lng: coordinates.lng,
      clients_id: req.user.clientId,
      locals_categories_id: storeInfo.locals_categories_id
        ? storeInfo.locals_categories_id
        : 1,
      menuLink: menu.menuOption === "link" ? menu.menuLink : null,
      menuFileUrl: menu.menuOption === "upload" ? menu.menuFile : null,
      einNumber: bankAccount?.taxId || null
    });

    // Construir los registros de horarios de atención
    const openHourRecords = [];
    if (hours.generalSchedule) {
      const weekDays = [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
      ];
      weekDays.forEach((day) => {
        hours.generalSchedule.forEach((slot) => {
          openHourRecords.push({
            local_id: newShop.id,
            day,
            open_hour: convertTo24Hour(slot.open),
            close_hour: convertTo24Hour(slot.close)
          });
        });
      });
    } else if (hours.daysOfWeek) {
      hours.daysOfWeek.forEach((dayObj) => {
        if (!dayObj.closed) {
          dayObj.slots.forEach((slot) => {
            openHourRecords.push({
              local_id: newShop.id,
              day: dayObj.day,
              open_hour: convertTo24Hour(slot.open),
              close_hour: convertTo24Hour(slot.close)
            });
          });
        }
      });
    }
    if (openHourRecords.length > 0) {
      await ShopOpenHours.bulkCreate(openHourRecords);
    }

    // Actualizar la información bancaria en el cliente (Client)
    if (bankAccount) {
      await Client.update(
        {
          routing_number: bankAccount.routingNumber,
          account_number: bankAccount.accountNumber,
          account_holder_name: bankAccount.legalName
        },
        {
          where: { id: req.user.clientId }
        }
      );
    }

    // Agregar los tags seleccionados a LocalTag
    if (
      Array.isArray(storeInfo.selectedTags) &&
      storeInfo.selectedTags.length > 0
    ) {
      for (const tag of storeInfo.selectedTags) {
        await LocalTag.create({
          tag_id: tag.id,
          local_id: newShop.id
        });
      }
    }

    // Opcional: procesar orderMethod o category si hace falta...

    // Obtener la tienda recién creada con horarios y tags
    const shop = await Local.findOne({
      where: { id: newShop.id },
      include: [
        { model: ShopOpenHours, as: "openingHours" },
        { model: Tag, as: "tags", through: { attributes: [] } }
      ]
    });

    res.json({
      error: false,
      created: "ok",
      result: shop,
      message: "Shop added successfully"
    });
  } catch (error) {
    console.error("Error adding shop:", error);
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
          state: '1'
        },
        include: [
          {
            model: Extra,
            as: 'extras',
            include: {
              model: ExtraOption,
              as: 'options'
            }
          }
        ]
      });

      return {
        id: category.id,
        name: category.name,
        products: products.map(product => ({
          id: product.id,
          discountPercentage: product.discountPercentage,
          finalPrice: product.finalPrice,
          name: product.name,
          availableFor: product.availableFor,
          price: product.price.toFixed(2),  // Corrección en la interpolación de la variable price
          description: product.description,
          image: product.img,
          preparationTime: product.preparationTime,
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

export const getAllLocalCategories = async (req, res) => {
  try {
    const categories = await LocalCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const getShopsOrderByCatDiscount = async (req, res) => {
  try {
    const shops = await Local.findAll({
      where: {
        status: '2',
      },
      include: [
        {
          model: ShopOpenHours,
          as: 'openingHours'
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

export const getProductsWithSchedule = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        AlwaysActive: false,
        discountSchedule: { [Op.ne]: null },
        [Op.and]: literal(
          'jsonb_array_length("Product"."discountSchedule"::jsonb) > 0'
        ),
      },
      include: [
        {
          model: Category,
          as: 'category',
          include: [{ model: Local, as: 'local' }],
        },
      ],
    });

    const result = products.map((p) => {
      const plain = p.get({ plain: true });
      plain.local = plain.category?.local || null;
      delete plain.category;
      return plain;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener productos con schedule:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};