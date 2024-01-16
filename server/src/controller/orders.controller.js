import getConnection from "../database.js";
import { io } from "../server.js";
 
export const getByLocalId = async (req,res) => {
    const { id } = req.params
    const connection = await getConnection()

    try {
        const result = await connection.query('SELECT * FROM orders WHERE orders.local_id = ?', [id])
        //si la variable orderStatus es true
        orderStatus(result);

        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

const orderStatus = async (req,res) => {
  
}


export const acceptOrder = async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();
    try {
   
        await connection.query('UPDATE orders SET status = ? WHERE id = ?', ["accepted", id]);
        

        const updatedOrder = await connection.query('SELECT * FROM orders WHERE id = ?', [id]);
        
        // Devuelve los detalles actualizados de la orden
        res.status(200).json(updatedOrder[0]);
    } catch (error) {
        console.error("Error al aceptar la orden:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

export const sendOrder = async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();
    try {
       
        await connection.query('UPDATE orders SET status = ? WHERE id = ?', ["sending", id]);
        
        
        const updatedOrder = await connection.query('SELECT * FROM orders WHERE id = ?', [id]);
        
        
        res.status(200).json(updatedOrder[0]);
    } catch (error) {
        console.error("Error al aceptar la orden:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

export const createOrder = async (req, res) => {
  const { delivery_fee, total_price, oder_details, local_id, users_id, status, date_time } = req.body;
  console.log(oder_details)

  try {
   
    if (!delivery_fee || !total_price || !oder_details || !local_id || !users_id || !status || !date_time) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    console.log("papa")
    const connection = await getConnection();
    const result = await connection.query(
      'INSERT INTO orders (delivery_fee, total_price, oder_details, local_id, users_id, status, date_time) VALUES (?, ?, ?, ?, ?, ?,?)',
      [delivery_fee, total_price, JSON.stringify(oder_details), local_id, users_id, status, date_time]
    );

    // Verifica si la inserción fue exitosa
    if (result.affectedRows === 1) {
      // Notifica a los clientes a través de Socket.IO
      io.emit('newOrder', { oder_details, local_id, users_id, status, date_time });

      res.status(201).json({ message: "Orden creada exitosamente" });
    } else {
      res.status(500).json({ message: "Error al crear la orden en la base de datos" });
    }
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getOrderUser = async (req, res) => {
  const { id } = req.params;
  const connection = await getConnection();
  
  try {
    const result = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(result)

    if (result.length > 0) {
      const user = result[0]; // Suponemos que solo se espera un usuario con ese ID
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const finishOrder = async (req, res) => {
  const { id } = req.params;
  const connection = await getConnection();
  try {
     
    await connection.query('UPDATE orders SET status = ? WHERE id = ?', ["finished", id]);
        
        
    const updatedOrder = await connection.query('SELECT * FROM orders WHERE id = ?', [id]);
      
      
      res.status(200).json(updatedOrder[0]);
  } catch (error) {
      console.error("Error al aceptar la orden:", error);
      res.status(500).json({ message: 'Error interno del servidor.' });
  }
}