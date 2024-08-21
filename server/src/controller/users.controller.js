import Address from "../models/addresses.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import sequelize from "../database.js";

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

  console.log("removiendo balance")
  
  console.log(req.body)
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

const deleteUserAddresses = async (userId) => {
  try {
    await Address.destroy({
      where: {
        users_id: userId
      }
    });
    console.log(`Direcciones del usuario ${userId} eliminadas correctamente.`);
  } catch (error) {
    console.error(`Error al eliminar las direcciones del usuario ${userId}:`, error);
    throw new Error(`Error al eliminar las direcciones del usuario ${userId}`);
  }
};

const deleteUserOrders = async (userId) => {
  try {
    await Order.destroy({
      where: {
        users_id: userId
      }
    });
    console.log(`Órdenes del usuario ${userId} eliminadas correctamente.`);
  } catch (error) {
    console.error(`Error al eliminar las órdenes del usuario ${userId}:`, error);
    throw new Error(`Error al eliminar las órdenes del usuario ${userId}`);
  }
};

const deleteUserAccount = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    await user.destroy();
    console.log(`Usuario ${userId} eliminado correctamente.`);
  } catch (error) {
    console.error(`Error al eliminar el usuario ${userId}:`, error);
    throw new Error(`Error al eliminar el usuario ${userId}`);
  }
};


export const deleteUser = async (req, res) => {
  const userId = req.user.userId; // Supongo que estás obteniendo el userId del token de autenticación

  try {
    // Eliminar direcciones del usuario
    await deleteUserAddresses(userId);

    // Eliminar órdenes del usuario
    await deleteUserOrders(userId);

    // Eliminar usuario
    await deleteUserAccount(userId);

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUserForWeb = async (req, res) => {
  const userId = req.params.id;

  try {
    // Busca el usuario por su ID utilizando el modelo User
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }



    const userForWeb = {
      id: user.id,
      name: user.name,
      phone: user.phone
      
    }

    res.status(200).json(userForWeb);
  } catch (error) {
    console.error('Error al consultar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}