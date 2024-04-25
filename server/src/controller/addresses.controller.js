import Address from '../models/addresses.js'

export const getAddressesByUser = async (req, res) => {
  try {
    const { id } = req.body;
    
    const addresses = await Address.findAll({ where: { users_id: id } });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};