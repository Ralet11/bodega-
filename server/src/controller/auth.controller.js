import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../functions/SendWelcomeEmail.js';
import { sendVerificationCodeEmail } from '../functions/sendPasswordReset.js';

const { Client, Local, User } = db;

export const registerClient = async (req, res) => {
  try {
    const { name, email, password, referencedCode } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    // Verificar que el email no esté en uso
    const existingEmailClient = await Client.findOne({ where: { email } });
    if (existingEmailClient) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Variable para almacenar el id del vendedor si se encuentra
    let affiliatedSellerId = null;

    // Si se proporcionó referencedCode, se busca un cliente (vendedor) que lo tenga
    if (referencedCode) {
      const seller = await Client.findOne({ where: { referencedCode } });
      if (seller) {
        affiliatedSellerId = seller.id;
      }
    }

    // Se crea el nuevo cliente.
    // No se asigna el campo "referencedCode" ya que los usuarios que tendrán código se crean manualmente.
    const newClient = await Client.create({
      name,
      email,
      password: hashedPassword,
      affiliatedSellerId
    });

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
      email: client.email,
      tutorialComplete: client.tutorialComplete,
      role: client.role,
      referencedCode: client.referencedCode
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

/* ===== USER Controllers (Local) ===== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body.clientData;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Bad Request. Please fill all fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      subscription: 0,
      authMethod: 'local'
    });

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

/* ===== Google Controllers ===== */
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

export const googleLogin = async (req, res) => {
  try {
    const { userInfo } = req.body;
    if (!userInfo || !userInfo.email) {
      return res.status(400).json({ message: "Missing user information from Google." });
    }

    let user = await User.findOne({ where: { email: userInfo.email } });
    if (!user) {
      return res.status(400).json({ message: "This email is not registered. Please sign up first." });
    }
    if (user.authMethod !== 'google') {
      return res.status(400).json({ message: "This email is registered with a different method. Please use the correct login method." });
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
      data: { token, client: userData, message: "Google Login successful" }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

/* ===== Apple Controllers ===== */
export const appleSignIn = async (req, res) => {
  try {
    const { userInfo } = req.body;
    if (!userInfo || !userInfo.appleUserId) {
      return res.status(400).json({ message: "Missing user information from Apple." });
    }

    let user = await User.findOne({ where: { appleUserId: userInfo.appleUserId } });
    if (!user) {
      user = await User.create({
        name: userInfo.fullName || 'Apple User',
        email: userInfo.email || '',
        password: null,
        phone: userInfo.phone || '',
        subscription: 0,
        authMethod: 'apple',
        appleUserId: userInfo.appleUserId
      });
    } else if (user.authMethod !== 'apple') {
      return res.status(400).json({ message: "This account is already registered with a different method." });
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
      data: { token, client: userData, message: "Apple Sign-In successful" }
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

    let user = await User.findOne({ where: { appleUserId: userInfo.appleUserId } });
    if (!user) {
      return res.status(400).json({ message: "This Apple ID is not registered. Please sign up first." });
    }
    if (user.authMethod !== 'apple') {
      return res.status(400).json({ message: "This Apple ID is registered with a different method. Please use the correct login method." });
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
      data: { token, client: userData, message: "Apple Login successful" }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

/* ===== GUEST login ===== */
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

/* ===== CLIENT Password Reset (existing) ===== */
export const requestResetCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Client.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = verificationCode;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const emailResult = await sendVerificationCodeEmail(email, verificationCode);
    if (emailResult.success) {
      return res.json({ success: true, message: "Verification code sent successfully." });
    } else {
      return res.status(500).json({ success: false, message: "Failed to send email." });
    }
  } catch (error) {
    console.error("Error sending verification code:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await Client.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }
    if (user.resetCode !== code) {
      return res.status(400).json({ success: false, message: "Invalid verification code." });
    }
    if (new Date() > user.resetCodeExpires) {
      return res.status(400).json({ success: false, message: "Verification code has expired." });
    }
    return res.json({ success: true, message: "Code verified successfully." });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const changeClientPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    client.password = hashedPassword;
    await client.save();

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/* ===== USER Password Reset (NEW) ===== */
export const requestResetCodeUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = verificationCode;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const emailResult = await sendVerificationCodeEmail(email, verificationCode);
    if (emailResult.success) {
      return res.json({ success: true, message: "Verification code sent successfully." });
    } else {
      return res.status(500).json({ success: false, message: "Failed to send email." });
    }
  } catch (error) {
    console.error("Error sending verification code to user:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const verifyResetCodeUser = async (req, res) => {
  console.log(req.body)
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }

    if (user.resetCode !== code) {
      return res.status(400).json({ success: false, message: "Invalid verification code." });
    }

    if (new Date() > user.resetCodeExpires) {
      return res.status(400).json({ success: false, message: "Verification code has expired." });
    }

    return res.json({ success: true, message: "Code verified successfully." });
  } catch (error) {
    console.error("Error verifying reset code for user:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const changeUserPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing user password:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
