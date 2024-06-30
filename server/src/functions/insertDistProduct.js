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
        "image_link": "https://www.nepawholesale.com/web/image/product.template/3417/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/fume-12ct-blue-razz-energy-drink-3417?category=459",
        "product_name": ".FUME 12CT BLUE RAZZ ENERGY DRINK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25766/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/show-leaf-2-for-1-29-15-ct-25766?category=1",
        "product_name": "SHOW LEAF 2 FOR $1.29 15 CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25757/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/swisher-blk-2-for-1-49-25757?category=1",
        "product_name": "SWISHER BLK 2 FOR $1.49"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25734/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/black-mild-1-39-casino-25ct-25734?category=1",
        "product_name": "BLACK & MILD $1.39 CASINO 25CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25733/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/blunt-ville-25-ct-1-29-25733?category=1",
        "product_name": "BLUNT VILLE 25 CT $1.29"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25700/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/big-dog-2-for-1-99-20ct-25700?category=1",
        "product_name": "BIG DOG 2 FOR $1.99 20CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25650/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hi-fi-5-for-0-99-15-ct-25650?category=1",
        "product_name": "HI-FI 5 FOR $0.99 15 CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25633/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/true-wraps-5-pk-80-25633?category=1",
        "product_name": "TRUE WRAPS 5 PK 80"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25568/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/black-mild-0-99-25ct-25568?category=1",
        "product_name": "BLACK & MILD $0.99 25CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/25480/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/hulkamania-10pk-hell-yea-honey-25480?category=1",
        "product_name": "HULKAMANIA 10PK HELL YEA HONEY"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/23632/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/loose-leaf-20-2-packs-cookies-cream-23632?category=1",
        "product_name": "LOOSE LEAF 20-2 PACKS COOKIES & CREAM"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/23631/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/loose-leaf-8-5-packs-russian-cream-23631?category=1",
        "product_name": "LOOSE LEAF 8-5 PACKS RUSSIAN CREAM"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/23456/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/city-life-5-for-1-29-23456?category=1",
        "product_name": "CITY LIFE 5 FOR $1.29"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/23426/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/swisher-leaf-2-49-10-3pk-23426?category=1",
        "product_name": "SWISHER LEAF $2.49 10-3PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/22396/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/lil-leaf-3-for-2-99-22396?category=1",
        "product_name": "LIL LEAF 3 FOR $2.99"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/22395/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/lil-leaf-10-5ct-22395?category=1",
        "product_name": "LIL LEAF 10-5CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/22387/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/gt-hd-reserve-3-15pk-22387?category=1",
        "product_name": "GT HD RESERVE 3-15PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/22087/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/black-mild-1-39-jazz-wood-tip-25ct-22087?category=1",
        "product_name": "BLACK & MILD $1.39 JAZZ  WOOD TIP 25CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/22009/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/show-2-for-0-99-z-palma-big-22009?category=1",
        "product_name": "SHOW 2 FOR $0.99 Z PALMA BIG"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/21790/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/gt-4-kings-watermelon-grape-4-for-1-19-15-pk-21790?category=1",
        "product_name": "GT 4 KINGS WATERMELON GRAPE 4 FOR $1.19 15 PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/21789/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/gt-4-kings-blueberry-pineapple-4-for-1-19-15-pk-21789?category=1",
        "product_name": "GT 4 KINGS BLUEBERRY PINEAPPLE 4 FOR $1.19 15 PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/21788/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/gt-4-kings-black-sweet-4-for-0-99-15-pk-21788?page=2&category=1",
        "product_name": "GT 4 KINGS BLACK SWEET 4 FOR $0.99 15 PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/21749/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/blunt-ville-25-ct-natural-deluxe-21749?page=2&category=1",
        "product_name": "BLUNT VILLE 25 CT NATURAL DELUXE"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/21566/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/loose-leaf-8-5-packs-honey-bourbon-21566?page=2&category=1",
        "product_name": "LOOSE LEAF 8-5 PACKS HONEY BOURBON"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/21215/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/garcia-y-vega-30ct-upr-english-corona-21215?page=2&category=1",
        "product_name": "GARCIA Y VEGA 30CT UPR ENGLISH CORONA"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/21213/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/white-owl-15pk-2-for-0-99-platinum-21213?page=2&category=1",
        "product_name": "WHITE OWL 15PK 2 FOR $0.99 PLATINUM"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/20179/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/white-owl-mini-3-for-1-29-20179?page=2&category=1",
        "product_name": "WHITE OWL MINI 3 FOR $1.29"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/20170/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/swisher-sweet-twin-pack-little-cigars-100s-200ct-20170?page=2&category=1",
        "product_name": "SWISHER SWEET TWIN PACK LITTLE CIGARS 100S-200CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/20133/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/pom-pom-3-for-1-19-20133?page=2&category=1",
        "product_name": "POM POM 3 FOR $1.19"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/20132/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/pom-pom-3-for-0-99-20132?page=2&category=1",
        "product_name": "POM POM 3 FOR $0.99"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17385/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/zig-zag-leaf-2-for-1-29-17385?page=2&category=1",
        "product_name": "ZIG ZAG LEAF 2 FOR $1.29"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17358/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/swisher-sweet-legend-2-for-1-49-17358?page=2&category=1",
        "product_name": "SWISHER SWEET LEGEND 2 FOR $1.49"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17357/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/swisher-sweet-little-cigar-100s-200ct-17357?page=2&category=1",
        "product_name": "SWISHER SWEET LITTLE CIGAR 100S-200CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17353/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/swisher-10-3pk-leaf-2-49-17353?page=2&category=1",
        "product_name": "SWISHER 10-3PK LEAF $2.49"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17351/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/swisher-10-3pk-leaf-17351?page=2&category=1",
        "product_name": "SWISHER 10-3PK LEAF"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17300/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/old-ranch-5-pk-40-17300?page=2&category=1",
        "product_name": "OLD RANCH 5 PK 40"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17245/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/gt-hd-2-for-0-99-big-15pk-17245?page=2&category=1",
        "product_name": "GT HD 2 FOR $0.99 BIG 15PK"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17235/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/game-2-for-0-99-17235?page=2&category=1",
        "product_name": "GAME 2 FOR $0.99"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17226/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/fiesta-5-for-0-99-15ct-17226?page=2&category=1",
        "product_name": "FIESTA 5 FOR $0.99 15CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17219/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/dutch-leaf-pure-2pk60-1-29-17219?page=2&category=1",
        "product_name": "DUTCH LEAF PURE 2PK60 $1.29"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17186/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/blackwood-wraps-8-5-packs-17186?page=2&category=1",
        "product_name": "BLACKWOOD WRAPS 8-5 PACKS"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/17184/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/big-dog-8-5ct-17184?page=2&category=1",
        "product_name": "BIG DOG 8-5CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/15605/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/garcia-vega-english-corona-tube-4-pk-20-ct-15605?page=2&category=1",
        "product_name": "GARCIA VEGA ENGLISH CORONA TUBE 4 PK/20 CT"
    },
    {
        "image_link": "https://www.nepawholesale.com/web/image/product.template/12923/image_512",
        "details_link": "https://www.nepawholesale.com/es_DO/shop/dutch-leaf-tropical-2pk60-1-49-12923?page=2&category=1",
        "product_name": "DUTCH LEAF TROPICAL 2PK60 $1.49"
    }
]


insertarDatos(jsonData).catch(err => console.error('Error general:', err));