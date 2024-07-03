import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bodega',
  password: 'root',
  port: 5432,
});

async function insertarDatos(jsonData) {
  const idProveedor = 3; // Campo fijo
  const subcategoryId = 15; // Campo fijo
  const brandId = 1; // Campo fijo
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
      console.log(`Fila insertada correctamente: ${res.rowCount}`);
    } catch (err) {
      console.error('Error al insertar fila:', err);
    }
  }

  await pool.end();
}

// Ejemplo de uso con tu nuevo JSON:
const jsonData = [
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12922/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/dutch-leaf-palma-2pk60-1-49-12922?page=3&category=1",
        "product_name": "DUTCH LEAF PALMA 2PK60 $1.49"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12921/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/dutch-leaf-gold-2pk60-1-49-12921?page=3&category=1",
        "product_name": "DUTCH LEAF GOLD 2PK60 $1.49"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12920/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/dutch-2-for-1-29-diamond-fusion-12920?page=3&category=1",
        "product_name": "DUTCH 2 FOR $1.29 DIAMOND FUSION"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12919/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-sweet-slam-12919?page=3&category=1",
        "product_name": "HULKAMANIA 10PK SWEET SLAM"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12918/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-blueberry-beast-12918?page=3&category=1",
        "product_name": "HULKAMANIA 10PK BLUEBERRY BEAST"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12917/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-grape-jam-slam-12917?page=3&category=1",
        "product_name": "HULKAMANIA 10PK GRAPE JAM SLAM"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12916/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-crushin-cream-12916?page=3&category=1",
        "product_name": "HULKAMANIA 10PK CRUSHIN CREAM"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12915/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-strawbrother-12915?page=3&category=1",
        "product_name": "HULKAMANIA 10PK STRAWBROTHER"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12914/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-hulkariginal-12914?page=3&category=1",
        "product_name": "HULKAMANIA 10PK HULKARIGINAL"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12913/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-bandana-banana-12913?page=3&category=1",
        "product_name": "HULKAMANIA 10PK BANDANA BANANA"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12912/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-wild-white-grape-12912?page=3&category=1",
        "product_name": "HULKAMANIA 10PK WILD WHITE GRAPE"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12736/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/backwoods-5-pk-40-zaza-gas-house-12736?page=3&category=1",
        "product_name": "BACKWOODS 5 PK 40 ZAZA GAS HOUSE"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12701/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/al-capone-10-10pk-12701?page=3&category=1",
        "product_name": "AL CAPONE 10-10PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12700/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/al-capone-60-2pk-12700?page=3&category=1",
        "product_name": "AL CAPONE 60-2PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12695/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/astro-leaf-12-3ct-3-for-2-99-12695?page=3&category=1",
        "product_name": "ASTRO LEAF 12-3CT 3 FOR $2.99"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12693/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/backwoods-24-ct-12693?page=3&category=1",
        "product_name": "BACKWOODS 24 CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12692/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/backwoods-3-pk-30-12692?page=3&category=1",
        "product_name": "BACKWOODS 3 PK 30"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12691/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/backwoods-5-pk-40-12691?page=4&category=1",
        "product_name": "BACKWOODS 5 PK 40"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12690/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/black-mild-1-19-25ct-12690?page=4&category=1",
        "product_name": "BLACK & MILD $1.19 25CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12689/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/black-mild-10-5pk-12689?page=4&category=1",
        "product_name": "BLACK & MILD 10-5PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12688/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/black-mild-25ct-12688?page=4&category=1",
        "product_name": "BLACK & MILD 25CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12687/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/black-mild-filter-tip-10-5pk-2-49-12687?page=4&category=1",
        "product_name": "BLACK & MILD FILTER TIP 10-5PK $2.49"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12686/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/blunt-ville-25-ct-12686?page=4&category=1",
        "product_name": "BLUNT VILLE 25 CT"
    }
]



insertarDatos(jsonData).catch(err => console.error('Error general:', err));