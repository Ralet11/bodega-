// Importar las dependencias necesarias
import Distributor from '../models/distributor.model.js';

// Función para crear un nuevo distribuidor
export const createDistributor = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    // Crear un nuevo distribuidor en la base de datos
    const newDistributor = await Distributor.create({
      name,
      email,
      phone,
      address
    });

    // Enviar la respuesta con el nuevo distribuidor
    res.status(201).json(newDistributor);
  } catch (error) {
    console.error('Error al crear el distribuidor:', error);
    res.status(500).json({ message: 'Error al crear el distribuidor', error });
  }
};

// Exportar las funciones del controlador
