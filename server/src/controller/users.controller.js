import getConnection from "../database.js";

export const getUserById = async (req, res) => {

  const userId = req.params.id;

  const connection = await getConnection();

  try {
    const result = await connection.query(
      "SELECT * FROM users u WHERE u.id = ?",
      [userId]
    );
    console.log(result)
    res.status(200).json(result);
    console.log(result)
  } catch (error) {
    console.error("Error al consultar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
