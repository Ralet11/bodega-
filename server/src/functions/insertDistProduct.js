import pkg from 'pg';
const { Pool } = pkg;

/* 
export const TOKEN_SECRET = 'some secret key'

export const DB_HOST = process.env.DB_HOST || 'database-bodega.cryueqiccrnl.us-east-2.rds.amazonaws.com'
export const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bodegastore.net'
export const DB_DATABASE =process.env.DB_DATABASE || 'bodegaBase'
export const DB_USER = process.env.DB_USER || 'postgres'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Bodega#123!' */

const pool = new Pool({
  user: 'postgres',
  host: 'database-bodega.cryueqiccrnl.us-east-2.rds.amazonaws.com',
  database: 'bodegaBase',
  password: 'Bodega#123!',
  port: 5432,
});

async function insertarDatos(jsonData) {
  const idProveedor = 1; // Campo fijo
  const subcategoryId = 34; // Campo fijo
  const brandId = 237; // Campo fijo
  const defaultPrice = 1.00; // Precio por defecto
  const defaultDescription = ""; // Descripción por defecto
  const now = new Date(); // Fecha y hora actual

  for (let item of jsonData) {
    const { product_name, image_link } = item;
    const price = defaultPrice; // Establecer el precio como predeterminado

    try {
      const query = {
        text: `INSERT INTO public."DistProducts"(
                id_proveedor, name, subcategory_id, price, description, image1, image2, image3, brand_id, "createdAt", "updatedAt")
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        values: [
          idProveedor,
          product_name,
          subcategoryId,
          price, // Usar el precio predeterminado
          defaultDescription,
          image_link, // Para image1
          image_link, // Para image2
          image_link, // Para image3
          brandId,
          now,
          now,
        ],
      };

      const res = await pool.query(query);
     
    } catch (err) {
      console.error('Error al insertar fila:', err);
    }
  }

  await pool.end();
}

// Ejemplo de uso con tu nuevo JSON:
const jsonData = [
  {
    "image_link": "https://www.nepawholesale.com/web/image/product.template/19040/image_512",
    "details_link": "https://www.nepawholesale.com/shop/y-max-auto-adaptor-dual-port-1ct-4003?category=579",
    "product_name": "Y-MAX 10FT C TYPE CABLE 1CT"
}
]


insertarDatos(jsonData).catch(err => console.error('Error general:', err));