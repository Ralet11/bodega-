import db from '../models/index.js';
const {Category, Product, Local, Order, Extra, ExtraOption, Promotion,PromotionType} = db;


import xlsx from 'xlsx';

// =============================
// Obtener productos por ID de categoría
// =============================
export const getByCategoryId = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const products = await Product.findAll({
      where: {
        categories_id: categoryId,
        state: "1",
      },
      include: [
        {
          model: Extra,
          as: 'extras',
          include: {
            model: ExtraOption,
            as: 'options',
          },
        },
        {
          model: Promotion,
          as: 'promotions',
          include: [
            {
              model: PromotionType,
              as: 'promotionType',
            },
          ],
          required: false,
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =============================
// Añadir un nuevo producto
// =============================
// addProduct (1:N)
export const addProduct = async (req, res) => {
  const { 
    name,
    price,
    description,
    img,
    category_id,
    extras = [],
    discountPercentage = 0
  } = req.body;
  
  const clientId = req.user.clientId;
  try {
    const finalPrice = price * (1 - discountPercentage / 100);

    // 1. Crea el producto
    const newProduct = await Product.create({
      name,
      price,
      description,
      img,
      categories_id: category_id,
      discountPercentage,
      finalPrice,
      state: 1,
      clientId
    });

    // 2. Crea cada extra, asignando productId
    for (const extra of extras) {
      const { name, options, required } = extra;
      const newExtra = await Extra.create({
        name,
        required,
        productId: newProduct.id // <-- Relación directa
      });

      // 3. Crea las opciones del extra
      for (const option of (options || [])) {
        await ExtraOption.create({
          name: option.name,
          price: option.price,
          extra_id: newExtra.id
        });
      }
    }

    // 4. Retorna el producto con sus extras y opciones
    const productWithExtras = await Product.findOne({
      where: { id: newProduct.id },
      include: [{
        model: Extra,
        as: 'extras',
        include: [{
          model: ExtraOption,
          as: 'options'
        }]
      }]
    });

    res.status(201).json(productWithExtras);
  } catch (error) {
    console.error('Error al añadir producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



// =============================
// Eliminar (inactivar) producto por ID
// =============================
export const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    // Actualiza el estado del producto a 0 (inactivo)
    await Product.update({ state: 0 }, {
      where: { id }
    });

    console.log(`Producto eliminado: ${id}`);
    res.status(200).json("Producto eliminado correctamente");
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// =============================
// Actualizar producto (y promotions). 
// * Se quita la lógica del Discount model y se maneja discountPercentage
// =============================
export const updateProduct = async (req, res) => {
  console.log(req.body, "body");

  const {
    productId,
    name,
    price,
    description,
    img,
    category_id,
    extras,
    discountPercentage = 0,
    promotion // Datos de promoción si es que vienen
  } = req.body;

  // Obtenemos el clientId del token/usuario
  const clientId = req.user.clientId;

  try {
    // Obtenemos el producto con sus asociaciones
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Extra,
          as: 'extras',
          include: [{ model: ExtraOption, as: 'options' }],
        },
        {
          model: Promotion,
          as: 'promotions',
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verificamos que el producto pertenezca al cliente logueado
    if (product.clientId !== clientId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Calcular finalPrice con el nuevo modelo
    const finalPrice = price * (1 - discountPercentage / 100);

    // Actualizamos detalles del producto
    await product.update({
      name,
      price,
      description,
      img,
      categories_id: category_id,
      discountPercentage,
      finalPrice
    });

    // -- Manejo de Extras --
    const existingExtras = product.extras || [];
    const incomingExtras = extras || [];

    // Mapa para saber qué extras ya existen en la BD (para actualizar/eliminar)
    const existingExtrasMap = existingExtras.reduce((map, extra) => {
      map[extra.id] = extra;
      return map;
    }, {});

    // Recorremos los extras que llegan del front
    for (const incomingExtra of incomingExtras) {
      if (incomingExtra.id) {
        // Actualizar extra existente
        const existingExtra = existingExtrasMap[incomingExtra.id];
        if (existingExtra) {
          await existingExtra.update({
            name: incomingExtra.name,
            required: incomingExtra.required,
            onlyOne: incomingExtra.onlyOne,
          });
          // Actualizamos/creamos opciones de ese Extra
          await handleOptionsUpdate(existingExtra, incomingExtra.options || []);
          // Quitamos del map para no eliminarlo después
          delete existingExtrasMap[incomingExtra.id];
        }
      } else {
        // Crear un nuevo Extra
        const newExtra = await Extra.create({
          name: incomingExtra.name,
          required: incomingExtra.required,
          onlyOne: incomingExtra.onlyOne,
        });

        // Crear las opciones de ese nuevo Extra
        for (const option of incomingExtra.options || []) {
          await ExtraOption.create({
            name: option.name,
            price: option.price,
            extra_id: newExtra.id,
          });
        }

        // Asociarlo al producto
        await product.addExtra(newExtra);
      }
    }

    // Eliminar extras que ya no existen en el request
    for (const extraId in existingExtrasMap) {
      const extraToDelete = existingExtrasMap[extraId];
      // Primero eliminamos sus opciones
      for (const option of extraToDelete.options) {
        await option.destroy();
      }
      // Quitamos la asociación en la tabla pivote
      await product.removeExtra(extraToDelete);
      // Finalmente, eliminamos el extra
      await extraToDelete.destroy();
    }

    // -- Manejo de Promociones (Buy To Win) --
    if (promotion && Object.keys(promotion).length > 0) {
      const { promotionTypeId, quantity, localId } = promotion;

      // Verificamos campos requeridos
      if (!promotionTypeId || !quantity || !localId) {
        return res.status(400).json({ message: 'Promotion data is incomplete' });
      }

      // Verificar si ya existe una promoción para este producto
      let existingPromotion = await Promotion.findOne({
        where: { productId: product.id },
      });

      if (existingPromotion) {
        // Actualizamos
        await existingPromotion.update({
          clientId,
          promotionTypeId,
          quantity,
          localId,
        });
      } else {
        // Creamos la nueva promoción
        await Promotion.create({
          clientId,
          promotionTypeId,
          productId: product.id,
          quantity,
          localId,
        });
      }
    } else {
      // Si no se envía promotion, eliminamos cualquier promoción que exista
      await Promotion.destroy({
        where: { productId: product.id },
      });
    }

    res.status(200).json({
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product and promotion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Función auxiliar para actualizar opciones de un Extra
async function handleOptionsUpdate(existingExtra, incomingOptions) {
  const existingOptions = existingExtra.options || [];

  const existingOptionsMap = existingOptions.reduce((map, option) => {
    map[option.id] = option;
    return map;
  }, {});

  for (const incomingOption of incomingOptions) {
    if (incomingOption.id) {
      // Opción existente
      const existingOption = existingOptionsMap[incomingOption.id];
      if (existingOption) {
        await existingOption.update({
          name: incomingOption.name,
          price: incomingOption.price,
        });
        console.log(`Option updated: ${incomingOption.name}`);
        delete existingOptionsMap[incomingOption.id];
      }
    } else {
      // Nueva opción
      await ExtraOption.create({
        name: incomingOption.name,
        price: incomingOption.price,
        extra_id: existingExtra.id,
      });
      console.log(`New option created: ${incomingOption.name}`);
    }
  }

  // Eliminar opciones no presentes
  for (const optionId in existingOptionsMap) {
    const optionToDelete = existingOptionsMap[optionId];
    await optionToDelete.destroy();
    console.log(`Deleted option: ${optionToDelete.name}`);
  }
}

// =============================
// Obtener productos por local_id
// =============================
export const getByLocalId = async (req, res) => {
  const { id } = req.params;
  const idConfirm = req.user.clientId; // clientId del usuario autenticado

  try {
    // Verificar local para comparar clientId
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Categorías activas de este local
    const categories = await Category.findAll({
      where: {
        local_id: id,
        state: "1"
      }
    });

    // IDs de categorías
    let catId = categories.map(cat => cat.id);

    // Productos de esas categorías activas
    const products = await Product.findAll({
      where: {
        categories_id: {
          [Op.in]: catId
        },
        state: "1"
      }
    });

    // Órdenes completadas
    const orders = await Order.findAll({
      where: {
        local_id: id,
        status: 'completed'
      }
    });

    // Objeto para agrupar totales
    const productTotals = {};

    orders.forEach(order => {
      let orderDetails;

      // order_details podría ser un string (JSON) o un objeto
      if (typeof order.order_details === 'string') {
        try {
          orderDetails = JSON.parse(order.order_details).details;
        } catch (err) {
          console.error('Error parsing order details:', err);
          return;
        }
      } else {
        orderDetails = order.order_details.details;
      }

      // Sumar totales
      orderDetails.forEach(detail => {
        if (!productTotals[detail.id]) {
          productTotals[detail.id] = {
            id: detail.id,
            name: detail.name,
            orderCount: 0,
            totalRevenue: 0
          };
        }
        productTotals[detail.id].orderCount += detail.quantity;
        productTotals[detail.id].totalRevenue += detail.quantity *
          parseFloat(detail.price.replace('$', '').replace('.', '').replace(',', '.'));
      });
    });

    // Mapear productos con orderCount y totalRevenue
    const productsWithOrderDetails = products.map(product => ({
      ...product.dataValues,
      orderCount: productTotals[product.id] ? productTotals[product.id].orderCount : 0,
      totalRevenue: productTotals[product.id] ? productTotals[product.id].totalRevenue : 0
    }));

    res.status(200).json(productsWithOrderDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al buscar productos por localId' });
  }
};

// =============================
// Obtener productos por clientId
// =============================
export const getProductsByClientId = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    // Productos activos por clientId
    const products = await Product.findAll({
      where: {
        clientId: id,
        state: "1"
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by client ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =============================
// Obtener producto por productId
// =============================
export const getByProductId = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Extra,
          as: 'extras',
          include: [
            {
              model: ExtraOption,
              as: 'options',
            },
          ],
          through: { attributes: [] },
        },
        // Se elimina Discount
        // {
        //   model: Discount,
        //   as: 'discounts',
        // },
        {
          model: Promotion,
          as: 'promotions',
          include: [
            {
              model: PromotionType,
              as: 'promotionType',
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =============================
// Guardar extras (relación productExtras)
// =============================
export const saveExtras = async (req, res) => {
  const { extras, productId } = req.body;

  try {
    // Verificar producto
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar relaciones previas
    // (Necesitas importar productExtras si lo manejas manualmente, 
    // pero con product.addExtra / product.removeExtra no siempre es necesario).
    await product.setExtras([]); // Limpia todas las asociaciones

    // Crear/actualizar extras
    const createdExtras = [];

    for (const extra of extras || []) {
      const { id, name, required, options, onlyOne } = extra;

      let newExtra;
      if (id) {
        // Actualizar extra existente
        newExtra = await Extra.findByPk(id);
        if (newExtra) {
          await newExtra.update({
            name,
            required,
            onlyOne
          });
        }
      } else {
        // Crear nuevo extra
        newExtra = await Extra.create({
          name,
          required,
          onlyOne
        });
      }

      // Eliminar opciones existentes de este extra
      await ExtraOption.destroy({
        where: { extra_id: newExtra.id }
      });

      // Crear nuevas opciones
      for (const option of options || []) {
        await ExtraOption.create({
          name: option.name,
          price: option.price,
          extra_id: newExtra.id
        });
      }

      // Asocia extra con producto
      await product.addExtra(newExtra);
      createdExtras.push(newExtra);
    }

    // Recuperar producto con sus extras actualizados
    const productWithExtras = await Product.findOne({
      where: { id: productId },
      include: {
        model: Extra,
        as: 'extras',
        include: {
          model: ExtraOption,
          as: 'options'
        },
        through: { attributes: [] }
      }
    });

    res.status(200).json(productWithExtras);
  } catch (error) {
    console.error('Error al guardar extras:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// =============================
// Cargar productos desde Excel a una categoría
// =============================
export const uploadExcelToCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const clientId = req.user.clientId;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const excelFile = req.files.file;
    const workbook = xlsx.read(excelFile.data);
    const sheetNameList = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNameList[0]];

    // Buscar primera fila con datos
    const range = xlsx.utils.decode_range(sheet['!ref']);
    let startRow = range.s.r;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      let cell = sheet[xlsx.utils.encode_cell({ r: R, c: range.s.c })];
      if (cell && cell.v) {
        startRow = R;
        break;
      }
    }

    // Convertir a JSON desde la fila detectada
    const products = xlsx.utils.sheet_to_json(sheet, { range: startRow });

    let createdProducts = [];
    let failedProducts = [];

    for (const productData of products) {
      try {
        // Si tu Excel trae un posible discountPercentage, lo tomas; si no, 0
        const discountPercentage = productData.discountPercentage || 0;
        const price = productData.price || 0;

        // Calcular finalPrice
        const finalPrice = price * (1 - (discountPercentage / 100));

        // Crear producto
        const createdProduct = await Product.create({
          name: productData.name,
          price: price,
          description: productData.description,
          img: productData.img,
          categories_id: categoryId,
          clientId: clientId,
          state: '1',
          discountPercentage,
          finalPrice
        });
        createdProducts.push(createdProduct.name);
      } catch (error) {
        console.error('Error creating product:', productData.name, error);
        failedProducts.push(productData.name);
      }
    }

    res.status(200).json({
      createdProducts,
      failedProducts
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};
