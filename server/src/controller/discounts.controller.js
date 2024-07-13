import Discount from "../models/discount.js";
import Local from "../models/local.js";
import Product from "../models/product.js";
import UserDiscount from "../models/userDiscount.js";
import Extra from "../models/extra.js";
import ExtraOption from "../models/extraOption.model.js";

export const getAll = async (req, res) => {
 

  try {
    // Busca productos por categoría y estado utilizando el modelo Product
    const discounts = await Discount.findAll();

    res.status(200).json(discounts);
  } catch (error) {
    console.error('Error al consultar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createDiscount = async (req, res) => {
  const { productName, shop_id, image, limitDate, percentage, fixedValue, order_details, product_id, category_id, usageLimit, description, discountType, minPurchaseAmount, maxDiscountAmount, conditions } = req.body;
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado

  try {
    // Buscar el local para verificar el clientId
    const local = await Local.findByPk(shop_id);

    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Crear el descuento
    const newDiscount = await Discount.create({
      productName,
      local_id: shop_id,
      image,
      limitDate,
      percentage,
      fixedValue,
      order_details,
      product_id,
      category_id,
      usageLimit,
      description,
      discountType,
      minPurchaseAmount,
      maxDiscountAmount,
      conditions,
      active: true,
      timesUsed: 0
    });

    res.status(200).json({ newDiscount, created: "ok" });

  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDiscountsByUser = async (req, res) => {
  console.log(req.user);
  const { userId } = req.user;

  try {
    const response = await UserDiscount.findAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Discount,
          attributes: ['id', 'productName', 'percentage', 'fixedValue', 'limitDate', 'discountType', 'conditions', 'image', 'local_id', 'delivery'],
          include: [
            {
              model: Local,
              as: 'local'
            }
          ]
        }
      ]
    });
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
export const getByLocalId = async (req, res) => {
  const { id } = req.params;
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado
  console.log(id);

  try {
    // Buscar el local para verificar el clientId
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    // Obtener los descuentos asociados al local e incluir los productos, extras y opciones de extras
    const discounts = await Discount.findAll({
      where: {
        local_id: id
      },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: Extra,
              as: 'extras',
              through: { attributes: [] }, // Excluir columnas de la tabla de unión
              include: {
                model: ExtraOption,
                as: 'options'
              }
            }
          ]
        }
      ]
    });

    console.log(discounts);
    res.status(200).json(discounts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al buscar descuentos por ID del local' });
  }
};

export const getUserDiscounts = async (req, res) => {
  const id = req.user.userId;

  try {
    const userDiscounts = await UserDiscount.findAll({
      where: {
        user_id: id
      }
    });

    // Si deseas formatear los datos o incluir información adicional, puedes hacerlo aquí
    const formattedDiscounts = userDiscounts.map(discount => ({
      id: discount.id,
      discountId: discount.discount_id,
      userId: discount.user_id,
      used: discount.used
    }));

    res.status(200).json(formattedDiscounts);
  } catch (error) {
    console.error('Error fetching user discounts:', error);
    res.status(500).json({ message: 'An error occurred while fetching user discounts.' });
  }
};

export const addDiscountToUser = async (req, res) => {
  const userId = req.user.userId;
  const { discountId } = req.body;

  try {
    // Verificar si el descuento ya ha sido agregado al usuario
    const existingDiscount = await UserDiscount.findOne({
      where: {
        user_id: userId,
        discount_id: discountId
      }
    });

    if (existingDiscount) {
      return res.status(400).json({ message: 'Discount already added to user' });
    }

    // Agregar el nuevo descuento al usuario
    const newUserDiscount = await UserDiscount.create({
      user_id: userId,
      discount_id: discountId,
      used: false
    });

    res.status(201).json(newUserDiscount);
  } catch (error) {
    console.error('Error adding discount to user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const useDiscountUser = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.body;

  try {
    // Verificar si el descuento ya ha sido agregado al usuario
    let userDiscount = await UserDiscount.findOne({
      where: {
        user_id: userId,
        discount_id: id
      }
    });

    if (userDiscount) {
      // Si existe, actualizar el estado a 'used'
      userDiscount.used = true;
      await userDiscount.save();
    } else {
      // Si no existe, agregarlo con el estado 'used' en true
      userDiscount = await UserDiscount.create({
        user_id: userId,
        discount_id: id,
        used: true
      });
    }

    res.status(200).json({ userDiscount, updated: "ok" });
  } catch (error) {
    console.error('Error updating user discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};