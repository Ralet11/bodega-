import Promotion from "../models/promotions.model.js";
import UserPromotions from "../models/UserPromotion.model.js";
import Client from "../models/client.js";
import Product from "../models/product.js";
import PromotionType from "../models/promotionType.js";

export const createPromotion = async (req, res) => {
  const { clientId, promotionTypeId, productId, quantity, localId } = req.body;
  console.log(req.body, "req.body");

  // Validar que los campos requeridos están presentes
  if (!clientId || !promotionTypeId || !productId || !quantity || !localId) {
    return res.status(400).json({
      message: 'Content is missing'
    });
  }

  try {
    // Verificar que el cliente exista
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        message: `Client with id ${clientId} not found`
      });
    }

    // Verificar que el tipo de promoción exista
    const promotionType = await PromotionType.findByPk(promotionTypeId);
    if (!promotionType) {
      return res.status(404).json({
        message: `Promotion type with id ${promotionTypeId} not found`
      });
    }

    // Verificar que el producto exista
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        message: `Product with id ${productId} not found`
      });
    }

    // Crear la promoción
    const promotion = await Promotion.create({
      clientId,
      promotionTypeId,
      productId,
      quantity,
      localId
    });

    return res.status(201).json({
      data: promotion
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Something went wrong creating the promotion'
    });
  }
};

export const getPromotionTypes = async (req, res) => {
  try {
    const promotionTypes = await PromotionType.findAll();
    return res.status(200).json(promotionTypes);
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Something went wrong fetching promotion types'
    });
  }
};

export const getByLocal = async (req, res) => {
  console.log("req.params prom", req.params);
  const { id } = req.params;
  try {
    const promotions = await Promotion.findAll({
      where: {
        localId: id
      },
      include: [{
        model: Product,
        as: 'product', // Alias definido en la relación de los modelos
        attributes: ['id', 'name', 'description', 'price', 'img'], // Selecciona los campos que deseas incluir del producto
      }]
    });
    console.log("sendingPromotionLocal", promotions);
    return res.status(200).json(promotions);

  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Something went wrong fetching promotions'
    });
  }
};
export const getUserPromotions = async (req, res) => {
  const { user_id, promotion_id } = req.body.data; // Se obtienen los datos del cuerpo de la solicitud
  try {
    // Validar que se pasen los datos necesarios
    if (!user_id || !promotion_id) {
      return res.status(400).json({
        message: 'User ID and Promotion ID are required'
      });
    }

    // Buscar la promoción del usuario en la base de datos
    const userPromotion = await UserPromotions.findOne({
      where: {
        userId: user_id,
        promotionId: promotion_id,
      }
    });

    // Si no se encuentra la promoción
    if (!userPromotion) {
      return res.status(200).json([]);
    }

    // Enviar la promoción del usuario encontrada
    return res.status(200).json(userPromotion);
  } catch (error) {
    // Manejar errores
    return res.status(500).json({
      message: error.message || 'Something went wrong fetching user promotions'
    });
  }
};
