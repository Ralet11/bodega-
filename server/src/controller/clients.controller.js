import Client from '../models/client.js';
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
    if (!clientId) {
      return res.status(400).json({ message: "Solicitud incorrecta. Por favor, proporcione un ID de cliente válido." });
    }

    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    res.json(client);
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
