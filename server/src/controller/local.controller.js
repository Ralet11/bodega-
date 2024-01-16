import getConnection from "../database.js";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';

export const getByClientId = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    const decoded = jwt.verify(tokenParts[1], 'secret_key');

    if (!decoded || !decoded.clientId) {
      return res.status(403).json({ message: 'Token inválido o falta el ID del cliente.' });
    }

    const clientId = decoded.clientId;

    const query = `SELECT l.* FROM local l WHERE l.clients_id = ${clientId}`

    const connection = await getConnection();

    const result = await connection.query(query, [clientId]);
    console.log(result)

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getById = async (req, res) => {
  const id = req.params.id;
  const connection = await getConnection();

  try {
    const result = await connection.query('SELECT * FROM local WHERE local.id = ?', [id]);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const changeStatus = async (req,res) => {
  const id = req.params.id;
  const { newStatus } = req.body; // Recibe el nuevo estado desde la solicitud POST

  const connection = await getConnection();
  try {
    // Actualiza el estado en la base de datos
    await connection.query('UPDATE local SET status = ? WHERE id = ?', [newStatus, id]);

    res.status(200).json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateShop = async (req, res) => {
  const { id, name, phone } = req.body;
  // Get a database connection (you may need to replace 'your-connection-module' with your actual import)
  const connection = await getConnection();

  try {
    // Update the shop information in your database
    await connection.query('UPDATE local SET name = ?, phone = ? WHERE id = ?', [name, phone, id]);

    res.status(200).json({ message: 'Shop information updated successfully' });
  } catch (error) {
    // Handle errors appropriately
    console.error('Error updating shop:', error);
    res.status(500).json({ message: 'Error updating shop' });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params
  const { address } = req.body
  const connection = await getConnection();

  try {
    await connection.query('UPDATE local SET address = ? WHERE id = ?', [address, id]);
    res.status(200).json("address updated")
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({ message: 'Error updating address' });
  }
}

export const getActiveShops = async (req, res) => {
 const connection = await getConnection()

 try {
    const shops = await connection.query("SELECT * from local")
    res.status(200).json(shops)

 } catch (error) {
  res.status(400).json(error)
 }
}