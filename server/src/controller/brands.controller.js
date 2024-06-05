import { where } from "sequelize"
import Brand from "../models/brands.models.js"

export const getAllBrands = async (req, res) => {
    try {
        const response = await Brand.findAll()
        console.log(response)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}

export const getAllBrandsByCategory = async (req, res) => {

    const id = req.params.id
    console.log(id)

    try {
        const response = await Brand.findAll({where:{
            subcategory_id: id
        }})
        console.log(response)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}
