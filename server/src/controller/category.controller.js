import getConnection from "../database.js";

export const getByLocalId = async (req, res) => {
    const { id } = req.params; 
    const connection = await getConnection();

    try {
        const result = await connection.query(`SELECT * FROM categories WHERE categories.local_id = ${id} AND state = 1`);

        res.status(200).json(result); 
    } catch (error) {
        console.error("Error al consultar categorías:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}


export const addCategory = async (req,res) => {
    const {local_id, name} = req.body
    const connection = await getConnection();

    try {
        const result = await connection.query(`
        INSERT INTO app_base.categories
        (name, local_id, state)
        VALUES
        ('${name}', ${local_id}, 1)`); 

        res.status(200).json(result); 
    } catch (error) {
        console.error("Error al consultar categorías:", error);
        res.status(500).json({ error: "Error interno del servidor" })
    }
}


export const hideById = async (req, res) => {
    const { id } = req.params;
    const connection = await getConnection();

    try {
        await connection.query('UPDATE categories SET state = 0 WHERE id = ?', [id]);

        console.log("Estado de la categoría actualizado a 0");
        res.status(200).json("Estado de la categoría actualizado correctamente");
    } catch (error) {
        console.error("Error al actualizar el estado de la categoría:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
