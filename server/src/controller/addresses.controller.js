import Address from '../models/addresses.js'

export const getAddressesByUser = async (req, res) => {
  try {
    const id = req.user.userId;
    
    const addresses = await Address.findAll({ where: { users_id: id } });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};


export const addAddressToUser = async (req, res) => {
  const userId = req.user.userId;
  const {
    formatted_address,
    name,
    houseNumber,
    streetName,
    additionalDetails,
    postalCode
  } = req.body;

  // Verificar si los campos obligatorios están presentes
  if (!formatted_address || !name || !houseNumber || !streetName || !postalCode) {
    console.log(formatted_address, name, houseNumber, streetName, postalCode)
    return res.status(400).json({ error: 'Missing required address fields' });
    
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
    res.status(500).json({ error: 'An error occurred while saving the address' });
    console.log(error);
  }
};
