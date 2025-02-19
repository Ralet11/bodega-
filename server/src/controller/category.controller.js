import db from '../models/index.js';
const { Category } = db;

export const getByLocalId = async (req, res) => {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // Convertir id a número

 

  if (isNaN(idNumber)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const categories = await Category.findAll({
      where: {
        local_id: idNumber,
        state: "1",
      },
    });

  

    res.status(200).json(categories);


  } catch (error) {
    console.error("Error al consultar categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const addCategory = async (req, res) => {
  const { local_id, name } = req.body;


  try {
    const newCategory = await Category.create({ name, local_id, state: 1 });
    res.status(201).json(newCategory); // Status 201 para indicar creación exitosa
  } catch (error) {
    console.error("Error al agregar categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const hideById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    category.state = 0;
    await category.save();


    res.status(200).json({ message: "Estado de la categoría actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado de la categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error al obtener todas las categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
