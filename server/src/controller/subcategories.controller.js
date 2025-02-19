import db from '../models/index.js';
const {Subcategory} = db;

export const getAllSubcategories = async (req, res) => {

   try {
    const response = await Subcategory.findAll()
    res.status(200).json(response)

   } catch (error) {
    res.status(500).json(error)
    console.log(error)
   }


}