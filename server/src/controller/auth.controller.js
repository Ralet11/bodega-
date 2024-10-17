import Client from '../models/client.js';
import Local from '../models/local.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../functions/SendWelcomeEmail.js';

// Registro de cliente con contraseña
export const registerClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    // Verificar si el cliente ya existe
    const existingEmailClient = await Client.findOne({ where: { email: email } });
    if (existingEmailClient) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newClient = await Client.create({ name, email, password: hashedPassword });

    await sendWelcomeEmail(name, email);
    res.json({
      error: false,
      data: {
        created: "ok",
        result: newClient,
        message: "Client added successfully"
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Inicio de sesión de cliente con contraseña
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    const client = await Client.findOne({ where: { email } });
    if (!client || !(await bcrypt.compare(password, client.password))) {
      return res.json({ error: true, data: { message: 'Incorrect user or password' } });
    }

    const payMethod = JSON.parse(client.pay_methods);
    const clientData = {
      name: client.name,
      address: client.address,
      payMethod,
      id: client.id,
      email: client.email
    };

    const locals = await Local.findAll({ where: { clients_id: client.id } });
    const token = jwt.sign({ clientId: client.id }, "secret_key", { expiresIn: '30d' });

    res.json({
      error: false,
      data: { token, client: clientData, locals }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Registro de usuario con contraseña
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body.clientData;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, phone, subscription: 0, authMethod: 'local' });

    const userData = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      birthDate: newUser.birthDate,
      id: newUser.id,
      address: newUser.address,
      subscription: newUser.subscription,
      balance: newUser.balance
    };

    const token = jwt.sign({ userId: newUser.id }, "secret_key");
    res.json({
      error: false,
      data: { token, client: userData, message: "User added successfully" }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Inicio de sesión de usuario con contraseña
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.clientData;

    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    if (user.authMethod === 'google') {
      return res.status(400).json({ message: "Please sign in with Google." });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,
      id: user.id,
      address: user.address,
      subscription: user.subscription,
      balance: user.balance,
      savings: user.savings
    };

    const token = jwt.sign({ userId: user.id }, "secret_key");
    res.json({
      error: false,
      data: { token, client: userData }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Google Sign-In
  export const googleSignIn = async (req, res) => {
    try {
      const { userInfo } = req.body;

      if (!userInfo || !userInfo.email) {
        return res.status(400).json({ message: "Missing user information from Google." });
      }

      let user = await User.findOne({ where: { email: userInfo.email } });

      if (!user) {
        user = await User.create({
          name: userInfo.name,
          email: userInfo.email,
          password: null,
          phone: userInfo.phone || '',
          subscription: 0,
          authMethod: 'google'
        });
      } else if (user.authMethod !== 'google') {
        return res.status(400).json({ message: "This email is already registered with a different method." });
      }

      const token = jwt.sign({ userId: user.id }, "secret_key");
      const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        id: user.id,
        subscription: user.subscription,
        balance: user.balance
      };

      res.json({
        error: false,
        data: { token, client: userData, message: "Google Sign-In successful" }
      });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  };

// Cerrar sesión
export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: "JWT cleared" });
};

// Inicio de sesión como invitado
export const loginGuest = async (req, res) => {
  try {
    const guestPayload = { role: 'guest' };
    const token = jwt.sign(guestPayload, "secret_key", { expiresIn: '24h' });

    const guestData = {
      name: 'Guest',
      email: null,
      phone: null,
      address: null,
      id: 'guest',
      role: 'guest',
      balance: 0
    };

    res.json({
      error: false,
      data: { token, client: guestData, message: "Logged in as guest" }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { userInfo } = req.body;

    if (!userInfo || !userInfo.email) {
      return res.status(400).json({ message: "Missing user information from Google." });
    }

    // Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ where: { email: userInfo.email } });

    if (!user) {
      return res.status(400).json({ message: "This email is not registered. Please sign up first." });
    }

    // Verificar si el usuario se registró con Google
    if (user.authMethod !== 'google') {
      return res.status(400).json({ message: "This email is registered with a different method. Please use the correct login method." });
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: user.id }, "secret_key");
    
    // Preparar los datos del usuario para la respuesta
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      id: user.id,
      subscription: user.subscription,
      balance: user.balance
    };

    // Enviar la respuesta con el token y la información del usuario
    res.json({
      error: false,
      data: { token, client: userData, message: "Google Login successful" }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const appleLogin = async (req, res) => {
  try {
    const { userInfo } = req.body;

    if (!userInfo || !userInfo.appleUserId) {
      return res.status(400).json({ message: "Missing user information from Apple." });
    }

    // Verificar si el usuario ya existe en la base de datos utilizando el appleUserId
    let user = await User.findOne({ where: { appleUserId: userInfo.appleUserId } });

    if (!user) {
      return res.status(400).json({ message: "This Apple ID is not registered. Please sign up first." });
    }

    // Verificar si el usuario se registró con Apple
    if (user.authMethod !== 'apple') {
      return res.status(400).json({ message: "This Apple ID is registered with a different method. Please use the correct login method." });
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: user.id }, "secret_key");

    // Preparar los datos del usuario para la respuesta
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      id: user.id,
      subscription: user.subscription,
      balance: user.balance
    };

    // Enviar la respuesta con el token y la información del usuario
    res.json({
      error: false,
      data: { token, client: userData, message: "Apple Login successful" }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const appleSignIn = async (req, res) => {
  try {
    const { userInfo } = req.body;

    if (!userInfo || !userInfo.appleUserId) {
      return res.status(400).json({ message: "Missing user information from Apple." });
    }

    // Buscar al usuario en la base de datos utilizando el appleUserId
    let user = await User.findOne({ where: { appleUserId: userInfo.appleUserId } });

    // Si el usuario no existe, crearlo
    if (!user) {
      user = await User.create({
        name: userInfo.fullName || 'Apple User',
        email: userInfo.email || '',  // A veces el correo no está disponible, por lo tanto podría estar vacío
        password: null,
        phone: userInfo.phone || '',
        subscription: 0,
        authMethod: 'apple',
        appleUserId: userInfo.appleUserId  // Guardar el ID de Apple para futuras referencias
      });
    } else if (user.authMethod !== 'apple') {
      // Si el usuario ya existe pero no se registró con Apple, retornar un error
      return res.status(400).json({ message: "This account is already registered with a different method." });
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: user.id }, "secret_key");

    // Preparar los datos del usuario para la respuesta
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      id: user.id,
      subscription: user.subscription,
      balance: user.balance
    };

    // Enviar la respuesta con el token y la información del usuario
    res.json({
      error: false,
      data: { token, client: userData, message: "Apple Sign-In successful" }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
