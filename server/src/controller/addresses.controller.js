import db from '../models/index.js';
const { Address } = db;

export const getAddressesByUser = async (req, res) => {
  console.log("holaaa");
  try {
    const id = req.user.userId;
    const addresses = await Address.findAll({ where: { users_id: id } });
    res.status(200).json(addresses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

export const addAddressToUser = async (req, res) => {
  const userId = req.user.userId;
  const {
    formatted_address,
    name = "",
    houseNumber = "",
    streetName = "",
    additionalDetails = "",
    postalCode = ""
  } = req.body;

  if (!formatted_address) {
    return res.status(400).json({ error: 'Missing required field: formatted_address' });
  }

  try {
    const newAddress = await Address.create({
      users_id: userId,
      name,
      formatted_address,
      houseNumber,
      streetName,
      additionalDetails,
      postalCode
    });
    res.status(200).json(newAddress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while saving the address' });
  }
};

export const deleteAddressByUser = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.userId;
    const deletedCount = await Address.destroy({ where: { adressID: addressId, users_id: userId } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Address not found or not authorized' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};
