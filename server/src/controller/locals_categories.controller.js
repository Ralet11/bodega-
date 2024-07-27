import LocalCategory from '../models/local_category.js';
import { Op } from 'sequelize';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await LocalCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
export const getAllCategoriesApp = async (req, res) => {
  try {
    const categories = await LocalCategory.findAll({
      where: {
        id: {
          [Op.notIn]: [1, 2, 5]
        }
      }
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
