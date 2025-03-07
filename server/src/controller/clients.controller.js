import db from '../models/index.js';
const { Client, Local} = db;

import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";



export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addClient = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    
    if (!name || !email || !password || !address || !phone) {
      return res.status(400).json({ message: "Solicitud incorrecta. Por favor, complete todos los campos." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await Client.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone
    });

    res.status(201).json({ message: "Cliente añadido correctamente", data: newClient });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const clientId = req.params.id; 
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado Authorization

    if (!clientId) {
      return res.status(400).json({ message: "Solicitud incorrecta. Por favor, proporcione un ID de cliente válido." });
    }

    const client = await Client.findByPk(clientId);
    const locals = await Local.findAll({ where: { clients_id: clientId } });

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    res.json({ client, locals, token });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Solicitud incorrecta. Por favor, complete todos los campos." });
    }

    const client = await Client.findOne({ where: { email } });

    if (!client || !(await bcrypt.compare(password, client.password))) {
      return res.status(401).json({ error: true, message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: client.id }, "secret_key", { expiresIn: '90d' });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 90 * 24 * 60 * 60 * 1000 });

    res.json({ error: false, token });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: "JWT eliminado" });
};

export const updateClient = async (req, res) => {
  try {
    const clientId = req.user.clientId;
    if (!clientId) {
      return res
        .status(400)
        .json({ message: "Invalid request. Please provide a valid client ID." });
    }

    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    // Extract the possible fields from req.body
    const {
      name,
      email,
      address,
      phone,
      accountNumber,
      accountHolderName,
      routingNumber
    } = req.body;

    // Only update fields if they're explicitly provided
    if (typeof name !== "undefined") {
      client.name = name;
    }
    if (typeof email !== "undefined") {
      client.email = email;
    }
    if (typeof address !== "undefined") {
      client.address = address;
    }
    if (typeof phone !== "undefined") {
      client.phone = phone;
    }
    if (typeof accountNumber !== "undefined") {
      client.account_number = accountNumber;
    }
    if (typeof accountHolderName !== "undefined") {
      client.account_holder_name = accountHolderName;
    }
    if (typeof routingNumber !== "undefined") {
      client.routing_number = routingNumber;
    }

    await client.save();

    return res.json({
      message: "Client updated successfully",
      data: client
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};


//change password
export const changePassword = async (req, res) => {
  try {
    const clientId = req.user.clientId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: "Solicitud incorrecta. Por favor, proporcione un ID de cliente válido." });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Solicitud incorrecta. Por favor, complete todos los campos." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, client.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the password
    client.password = hashedPassword;

    await client.save();

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: true, message: "Error del servidor. Inténtelo de nuevo más tarde." });
  }
};

export const completeTutorial = async (req, res) => {
  const clientId = req.user.clientId;
  console.log(clientId, "id")

  try {
    // Buscamos el cliente por su ID
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Actualizamos el campo tutorialComplete a true
    await client.update({ tutorialComplete: true });

    return res.status(200).json({
      message: 'Tutorial completed successfully',
      tutorialComplete: true,
    });
  } catch (error) {
    console.error('Error completing tutorial:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getClientSecurityData = async (req, res) => {
  try {
    const clientId = req.user.clientId;
    if (!clientId) {
      return res.status(400).json({ message: "ID de cliente inválido." });
    }
    
    const client = await Client.findByPk(clientId, {
      attributes: ['idNumber', 'ssn']
    });
    
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }
    
    res.json({
      idNumber: client.idNumber,
      ssn: client.ssn
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }
};