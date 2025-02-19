import db from '../models/index.js';
const {Tag} = db;

export const getAll= async (req, res) => {
  try {
    
    const tags = await Tag.findAll();

    res.json({ data: tags });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}