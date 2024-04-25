import User from "../models/user.js";

export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Busca el usuario por su ID utilizando el modelo User
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al consultar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
