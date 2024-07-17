import Client from '../models/client.js';
import Local from '../models/local.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerClient = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    if (!name || !email || !password || !address || !phone) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    // Check if client with the same email already exists
    const existingEmailClient = await Client.findOne({ where: {email: email} });
    if (existingEmailClient) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if client with the same phone number already exists
    const existingPhoneClient = await Client.findOne({ where: {phone: phone} });
    if (existingPhoneClient) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await Client.create({ name, email, password: hashedPassword, address, phone });

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

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

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
      id: client.id
    };

    const locals = await Local.findAll({
      where: {
        clients_id: client.id
      }
    });

    console.log(locals)

    const token = jwt.sign({ clientId: client.id }, "secret_key");

    res.json({
      error: false,
      data: {
        token,
        client: clientData,
        locals
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: "JWT Clear" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body.clientData;

    if (!name || !email || !password || !phone) {
    
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword, phone, subscription: 0 });

    console.log(newUser, "usuario neuvo")

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
      data: {
        token,
        client: userData,
        message: "User added successfully"
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.clientData;

    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ error: true, data: { message: 'Incorrect user or password' } });
    }

    console.log(user, "chequeando user")

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

    console.log(user, "address del user")

    const token = jwt.sign({ userId: user.id }, "secret_key", { expiresIn: "1h" });

    res.json({
      error: false,
      data: {
        token,
        client: userData
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
