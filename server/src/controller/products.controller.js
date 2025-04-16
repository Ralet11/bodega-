import db from '../models/index.js';
const {Category, Product, Local, Order, Extra, ExtraOption, Promotion,PromotionType, ProductSchedule} = db;
import { Op } from 'sequelize';

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
        state: '1',
        discountPercentage: {
          [Op.ne]: 0,    // discountPercentage != 0
          [Op.not]: null // discountPercentage != null
        },
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
        {
          model: ProductSchedule,
          as: 'productSchedules',
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
  // Obtenemos clientId del token (por ejemplo, req.user.clientId)
  const clientId = req.user.clientId;

  // Extraemos los datos que nos llegan del front.
  // Observa que 'price' y 'finalPrice' se almacenan en el modelo (ajusta según tu lógica).
  const {
    name,
    price,            // precio base o final (según tu flujo)
    finalPrice,       // si manejas un precio final separado
    description,
    img,
    category_id,
    extras = [],
    discountPercentage = 0,
    preparationTime,
    // NUEVO: campos para descuentos 24h / franjas
    AlwaysActive = false,
    discountSchedule = null,   // puede ser null o un array con [{ start, end }, ...]
  } = req.body;

  try {
    // Creamos el producto
    const newProduct = await Product.create({
      name,
      price,
      description,
      img,
      categories_id: category_id,
      discountPercentage,
      finalPrice,
      state: 1,
      clientId,
      preparationTime,
      AlwaysActive,
      // Si AlwaysActive es true, podrías forzar discountSchedule = null
      // pero normalmente el front ya lo envía así.
      discountSchedule: AlwaysActive ? null : discountSchedule
    });

    // Creamos cada extra (si corresponde)
    for (const extra of extras) {
      const { name, options, required } = extra;

      const newExtra = await Extra.create({
        name,
        required,
        productId: newProduct.id,
      });

      // Creamos las opciones de cada extra
      for (const option of options || []) {
        await ExtraOption.create({
          name: option.name,
          price: option.price,
          extra_id: newExtra.id,
        });
      }
    }

    // Retornamos el producto con sus extras
    const productWithExtras = await Product.findOne({
      where: { id: newProduct.id },
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
        },
      ],
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
  const clientId = req.user.clientId;

  const {
    productId,
    name,
    price,
    finalPrice,
    description,
    img,
    category_id,
    extras,
    discountPercentage = 1,
    promotion,
    // NUEVO: campos de descuentos 24h / franjas
    AlwaysActive = false,
    discountSchedule = null,
  } = req.body;

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

    // Actualizamos detalles del producto
    await product.update({
      name,
      price,
      description,
      img,
      categories_id: category_id,
      discountPercentage,
      finalPrice,
      // NUEVO
      AlwaysActive,
      discountSchedule: AlwaysActive ? null : discountSchedule,
    });

    // -- Manejo de Extras --
    const existingExtras = product.extras || [];
    const incomingExtras = extras || [];

    // Mapeo para saber qué extras ya existen (para actualizarlos o borrarlos)
    const existingExtrasMap = existingExtras.reduce((map, extra) => {
      map[extra.id] = extra;
      return map;
    }, {});

    // Recorremos los extras del request
    for (const incomingExtra of incomingExtras) {
      if (incomingExtra.id) {
        // Extra existente
        const existingExtra = existingExtrasMap[incomingExtra.id];
        if (existingExtra) {
          await existingExtra.update({
            name: incomingExtra.name,
            required: incomingExtra.required,
            onlyOne: incomingExtra.onlyOne,
          });
          // Actualizar/crear opciones
          await handleOptionsUpdate(existingExtra, incomingExtra.options || []);
          delete existingExtrasMap[incomingExtra.id];
        }
      } else {
        // Nuevo extra
        const newExtra = await Extra.create({
          name: incomingExtra.name,
          required: incomingExtra.required,
          onlyOne: incomingExtra.onlyOne,
        });
        // Crear sus opciones
        for (const option of incomingExtra.options || []) {
          await ExtraOption.create({
            name: option.name,
            price: option.price,
            extra_id: newExtra.id,
          });
        }
        // Asociar al producto
        await product.addExtra(newExtra);
      }
    }

    // Eliminar extras que no llegan en el request
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

    // -- Manejo de Promociones --
    if (promotion && Object.keys(promotion).length > 0) {
      const { promotionTypeId, quantity, localId } = promotion;
      if (!promotionTypeId || !quantity || !localId) {
        return res.status(400).json({ message: 'Promotion data is incomplete' });
      }

      // Verificar si ya existe una promoción
      let existingPromotion = await Promotion.findOne({
        where: { productId: product.id },
      });

      if (existingPromotion) {
        await existingPromotion.update({
          clientId,
          promotionTypeId,
          quantity,
          localId,
        });
      } else {
        await Promotion.create({
          clientId,
          promotionTypeId,
          productId: product.id,
          quantity,
          localId,
        });
      }
    } else {
      // Si no se envía promotion, eliminamos cualquier promoción existente
      await Promotion.destroy({
        where: { productId: product.id },
      });
    }

    res.status(200).json({ message: 'Product updated successfully' });
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
        delete existingOptionsMap[incomingOption.id];
      }
    } else {
      // Nueva opción
      await ExtraOption.create({
        name: incomingOption.name,
        price: incomingOption.price,
        extra_id: existingExtra.id,
      });
    }
  }

  // Eliminar las opciones que no llegan
  for (const optionId in existingOptionsMap) {
    const optionToDelete = existingOptionsMap[optionId];
    await optionToDelete.destroy();
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

export const getInventoryProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        discountPercentage: 0
      },
    });

    return res.json(products);
  } catch (error) {
    console.error('Error getting inventory products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const pushInventoryProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      discountPercentage,
      finalPrice,
      AlwaysActive,
      discountSchedule,
      categories_id
    } = req.body;

    // Encontramos el producto
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Actualizamos los campos correspondientes
    product.discountPercentage = discountPercentage;
    product.finalPrice = finalPrice;
    product.AlwaysActive = AlwaysActive;
    product.discountSchedule = discountSchedule; // puede ser null o un array
    if (categories_id) {
      product.categories_id = categories_id;
    }

    await product.save();

    return res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating inventory product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};