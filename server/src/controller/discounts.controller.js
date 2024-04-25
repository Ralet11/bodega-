import Discount from "../models/discount.js";
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
    const {productName, initialPrice, discountPrice, shop_id, image, limitDate, percentage, order_details} = req.body
    console.log(order_details, "init price")

    try {
        const newDiscount = await Discount.create({
            productName,
            initialPrice,
            discountPrice,
            local_id: shop_id,
            image,
            limitDate,
            percentage,
            order_details
        })

        res.status(200).json({newDiscount, created: "ok"})

    } catch (error) {
        res.json(error)
        console.log(error)
    }
}

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

export const getByLocalId = async (req,res) => {
  
  const {id} = req.body

  try {
    const response = await Discount.findAll({
      where:{
        local_id: id
      }
    })
    console.log(response)
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}
