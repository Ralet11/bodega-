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

export const updateUser = async (req, res) => {
  const userId = req.user.userId;
  const { name, email, phone, address, password } = req.body;

  console.log(userId)

  try {
    // Encuentra el usuario por ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualiza los datos del usuario
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (password) {
      user.password = password; // Asegúrate de que tu modelo de usuario maneje el hashing de la contraseña
    }

    // Guarda los cambios en la base de datos
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
export const addSubscription = async (req, res) => {
  const userId = req.user.userId
   try {
     const user = await User.findByPk(userId);
   
     if (!user) {
       return res.status(404).json({ message: 'Usuario no encontrado' });
     }
 
     user.subscription = 1

     await user.save();

     res.status(200).json(user);
 
   } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
   }
 }

 export const addUserBalance = async (req, res) => {
  
  const {price} = req.body
  const userId = req.user.userId


  try {
    const user = await User.findOne({where: {id: userId}})

    if (!user) {
      console.log("error")
      return res.status(404).json({ error: "User not found" });
    }
    const newBalance =(user.balance + price)

    user.balance = newBalance

    await user.save()

    res.status(200).json(user)

  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

export const removeUserBalance = async (req, res) => {
  const {newBalance} = req.body
  const userId = req.user.userId
  try {
    const user = await User.findOne({where: {id: userId}})

    if (!user) {
      console.log("error")
      return res.status(404).json({ error: "User not found" });
    }

    user.balance = newBalance

    await user.save()

    res.status(200).json(user)

  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}