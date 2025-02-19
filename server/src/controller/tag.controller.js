import db from '../models/index.js';
const {Tag} = db;

export const getAllByLocalCat = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tags = await Tag.findAll({
      where: {
        local_category_id: id
      }
    });

    res.json({ data: tags });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}