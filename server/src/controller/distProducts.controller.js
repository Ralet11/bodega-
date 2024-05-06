import DistProduct from "../models/distProducts.model.js"

export const getAllDistProducts = async (req, res) => {
    try {
        const response = await DistProduct.findAll()

        res.status(200).json(response)
    } catch (error) {
        res.json(error)
    }
}

export const addDistProduct = async (req, res) => {
    const { id_proveedor, name, category, price, description, image1, image2, image3,feature_1, feature_2, feature_3 } = req.body

    try {
        // Crear un nuevo producto distribuido
        const newProduct = await DistProduct.create({
            id_proveedor,
            name,
            category,
            price,
            description,
            image1,
            image2,
            image3,
            feature_1,
            feature_2,
            feature_3
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el producto" });
        console.log(error)
    }
}

export const getDistProductById = async (req, res) => {
    const { id } = req.params; // Cambiado de req.body a req.params para obtener el ID de la URL

    try {
        // Encontrar el producto distribuido por su ID
        const product = await DistProduct.findByPk(id);

        if (product) {
            // Si se encuentra el producto, enviarlo como respuesta
            res.status(200).json(product);
        } else {
            // Si no se encuentra el producto, devolver un error
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        // Si hay algún error, devolver un mensaje de error genérico
        res.status(500).json({ error: "Error al obtener el producto" });
    }
}