import Category from '../models/category.js';
import Product from '../models/product.js';
import { Op } from 'sequelize';
import Local from '../models/local.js';
import Order from '../models/order.js';

export const getByCategoryId = async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Busca productos por categoría y estado utilizando el modelo Product
    const products = await Product.findAll({
      where: {
        categories_id: categoryId,
        state: "1" // Considera solo productos activos
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error al consultar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, description, img, category_id } = req.body;

  console.log(req.body)

  try {
    // Crea un nuevo producto utilizando el modelo Product
    const newProduct = await Product.create({
      name,
      price,
      description,
      img: `${img}`,
      categories_id: category_id,
      state: 1 // Se establece el estado activo por defecto
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al añadir producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    // Actualiza el estado del producto a 0 para marcarlo como inactivo
    await Product.update({ state: 0 }, {
      where: {
        id
      }
    });

    console.log(`Producto eliminado: ${id}`);
    res.status(200).json("Producto eliminado correctamente");
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateById = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    // Actualiza el producto utilizando el modelo Product
    await Product.update({
      name,
      price,
      description
    }, {
      where: {
        id
      }
    });

    console.log(`Producto ${id} actualizado con éxito`);
    res.status(200).json("Producto actualizado correctamente");
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Obtener las categorías activas asociadas al local
    const categories = await Category.findAll({
      where: {
        local_id: id,
        state: "1"
      }
    });

    let catId = categories.map(cat => cat.id);

    // Obtener los productos asociados a las categorías activas
    const products = await Product.findAll({
      where: {
        categories_id: {
          [Op.in]: catId // Utilizamos el operador "in" para buscar en un array de IDs
        },
        state: "1" // Considera solo productos activos
      }
    });

    // Obtener las órdenes asociadas a este local
    const orders = await Order.findAll({
      where: {
        local_id: id,
        status: 'completed' // Solo órdenes completadas
      }
    });

    // Crear un objeto para agrupar los productos y calcular los totales
    const productTotals = {};

    orders.forEach(order => {
      let orderDetails;

      // Verifica si order.order_details es una cadena o un objeto
      if (typeof order.order_details === 'string') {
        try {
          orderDetails = JSON.parse(order.order_details).details;
        } catch (err) {
          console.error('Error parsing order details:', err);
          return; // Salir del foreach para este pedido específico
        }
      } else {
        orderDetails = order.order_details.details;
      }

      // Iterar sobre los detalles del pedido
      orderDetails.forEach(detail => {
        if (!productTotals[detail.id]) {
          productTotals[detail.id] = {
            id: detail.id,
            name: detail.name,
            orderCount: 0,
            totalRevenue: 0
          };
        }
        productTotals[detail.id].orderCount += detail.quantity;
        productTotals[detail.id].totalRevenue += detail.quantity * parseFloat(detail.price.replace('$', '').replace('.', '').replace(',', '.'));
      });
    });

    // Mapear los productos originales para incluir los totales calculados
    const productsWithOrderDetails = products.map(product => ({
      ...product.dataValues,
      orderCount: productTotals[product.id] ? productTotals[product.id].orderCount : 0,
      totalRevenue: productTotals[product.id] ? productTotals[product.id].totalRevenue : 0
    }));

    console.log('Products with Order Details:', productsWithOrderDetails);
    res.status(200).json(productsWithOrderDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al buscar productos por IDs locales' });
  }
};