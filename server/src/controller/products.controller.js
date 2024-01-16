import getConnection from "../database.js";

export const getByCategoryId = async (req, res) => {

  const categoryId = req.params.id;

  const connection = await getConnection();

  try {
    const result = await connection.query(
      "SELECT * FROM products p WHERE p.categories_id = ? AND p.state = 1",
      [categoryId]
    );
    res.status(200).json(result);
    console.log(result)
  } catch (error) {
    console.error("Error al consultar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const addProduct = async (req,res) => {
    const {name, price, description, img, category_id} = req.body

    const connection = await getConnection();

    try {
        const result = await connection.query(`
        INSERT INTO app_base.products
        (name, price, description, img, categories_id, state)
        VALUES
        ('${name}', ${price}, '${description}', '${img}', ${category_id}, 1);`)
        res.json(result)
    } catch (error) {
        console.error("Error al consultar productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    };

    export const deleteById = async (req, res) => {
      const { id } = req.params;
      const connection = await getConnection();
  
      try {
        await connection.query('UPDATE products SET state = 0 WHERE id = ?', [id]);
  
          console.log("Producto eliminado:" + id);
          res.status(200).json("producto eliminada correctamente");
      } catch (error) {
          console.error("Error al eliminar la producto:", error);
          res.status(500).json({ error: "Error interno del servidor" });
      }
  };
  
  export const UpdateById = async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
  
    const connection = await getConnection();
    const query = `
      UPDATE products
      SET name = ?, price = ?, description = ?
      WHERE id = ?;
    `;
  
    try {
      // Ejecuta la consulta SQL con los parámetros proporcionados
      await connection.query(query, [name, price, description, id]);
      console.log(`Producto ${id} actualizado con éxito`);
      res.status(200).json("Actualizado correctamente");
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor al actualizar el producto.' });
    }
  };
  