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
  const userId = req.user.userId
  const {formatted_address, name} = req.body
  try {
    const newAddress = await Address.create({
      users_id: userId,
      name,
      formatted_address
    })

    res.status(200).json(newAddress)
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}