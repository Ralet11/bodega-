import Category from '../models/category.js';
import Product from '../models/product.js';
import { Op } from 'sequelize';

export const getByCategoryId = async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Busca productos por categoría y estado utilizando el modelo Product
    const products = await Product.findAll({
      where: {
        categories_id: categoryId,
        state: 1 // Considera solo productos activos
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
  
  const {id} = req.params

  try {

    const categories = await Category.findAll({
      where: {
        local_id: id,
        state: 1
      }
    })

    let catId = []

    categories.map((cat) => {
      catId.push(cat.id)
    })



    const response = await Product.findAll({
      where: {
        categories_id: {
          [Op.in]: catId // Utilizamos el operador "in" para buscar en un array de IDs
        }
      }
    });

    res.status(200).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al buscar productos por IDs locales' });
  }
}