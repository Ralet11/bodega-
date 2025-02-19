import db from '../models/index.js';
const {UserPromotions, Product, Client, Promotion,PromotionType} = db;

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
  const { user_id, localId } = req.body.data; // Ajustamos a localId si es el caso
  try {
    if (!user_id || !localId) {
      return res.status(400).json({
        message: 'User ID and Local ID are required',
      });
    }

    console.log('Request Data:', { user_id, localId }); // Para validar los datos recibidos

    const userPromotion = await UserPromotions.findOne({
      where: {
        userId: user_id,
        localId: localId, // Ajustamos al campo correcto
      },
    });

    if (!userPromotion) {
      return res.status(200).json([]); // Retornamos un array vacío si no hay datos
    }

    return res.status(200).json(userPromotion);
  } catch (error) {
    console.error('Error fetching user promotions:', error); // Imprimimos el stack del error
    return res.status(500).json({
      message: error.message || 'Something went wrong fetching user promotions',
    });
  }
};
