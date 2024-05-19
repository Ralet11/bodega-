import Discount from "../models/discount.js";
import Local from "../models/local.js";
import UserDiscount from "../models/userDiscount.js";

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
  const { productName, initialPrice, discountPrice, shop_id, image, limitDate, percentage, order_details } = req.body;
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado

  console.log(order_details, "init price");

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
          initialPrice,
          discountPrice,
          local_id: shop_id,
          image,
          limitDate,
          percentage,
          order_details
      });

      res.status(200).json({ newDiscount, created: "ok" });

  } catch (error) {
      console.error('Error creating discount:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDiscountsByUser = async (req,res) => {
  console.log(req.user)
  const {userId} = req.user

  try {
    const response = UserDiscount.findAll({
      where:{
        user_id: userId
      }
    })
    console.log("enviando descuentos por usuario")
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

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

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Obtener los descuentos asociados al local
    const discounts = await Discount.findAll({
      where: {
        local_id: id
      }
    });

    console.log(discounts);
    res.status(200).json(discounts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al buscar descuentos por ID del local' });
  }
};