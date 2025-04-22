import db from '../models/index.js';
import { parse, isBefore } from "date-fns";
const { Category, Product, Local, Order, Extra, ExtraOption, Promotion, PromotionType, ProductSchedule, DiscountSchedule } = db;
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
export const addProduct = async (req, res) => {
  const clientId = req.user.clientId;
  const {
    name,
    price,
    finalPrice,
    description,
    img,
    category_id,
    extras = [],
    discountPercentage = 0,
    preparationTime,
    AlwaysActive = false,
    discountSchedule = null,
  } = req.body;

  try {
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
      discountSchedule: AlwaysActive ? null : discountSchedule
    });

    
    // Crear extras
    for (const extra of extras) {
      const { name, options, required, onlyOne } = extra;
      const newExtra = await Extra.create({
        name,
        required,
        onlyOne,
        productId: newProduct.id,
      });
      for (const option of options || []) {
        await ExtraOption.create({
          name: option.name,
          price: option.price,
          extra_id: newExtra.id,
        });
      }
    }

    const productWithExtras = await Product.findOne({
      where: { id: newProduct.id },
      include: [
        { model: Extra, as: 'extras', include: [{ model: ExtraOption, as: 'options' }] }
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
    await Product.update({ state: 0 }, { where: { id } });
    res.status(200).json("Producto eliminado correctamente");
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// =============================
// Actualizar producto (y promotions, schedules)
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
    AlwaysActive = false,
    discountSchedule = null,
  } = req.body;

  try {
    const product = await Product.findByPk(productId, {
      include: [
        { model: Extra, as: 'extras', include: [{ model: ExtraOption, as: 'options' }] },
        { model: Promotion, as: 'promotions' },
      ],
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.clientId !== clientId) return res.status(403).json({ error: 'Forbidden' });

    // Actualizar producto
    await product.update({
      name,
      price,
      description,
      img,
      categories_id: category_id,
      discountPercentage,
      finalPrice,
      AlwaysActive,
      discountSchedule: AlwaysActive ? null : discountSchedule,
    });

    console.log('BODY >>>', req.body);

    // Gestionar ProductSchedule
    await ProductSchedule.destroy({ where: { productId: product.id } });
    if (!AlwaysActive && Array.isArray(discountSchedule)) {
      for (const { start, end } of discountSchedule) {
        await ProductSchedule.create({ productId: product.id, start, end });
      }
    }

    // Manejo de extras
    const existingExtras = product.extras || [];
    const incomingExtras = extras || [];
    const existingExtrasMap = existingExtras.reduce((map, extra) => {
      map[extra.id] = extra;
      return map;
    }, {});
    for (const incomingExtra of incomingExtras) {
      if (incomingExtra.id && existingExtrasMap[incomingExtra.id]) {
        const ex = existingExtrasMap[incomingExtra.id];
        await ex.update({
          name: incomingExtra.name,
          required: incomingExtra.required,
          onlyOne: incomingExtra.onlyOne,
        });
        await handleOptionsUpdate(ex, incomingExtra.options || []);
        delete existingExtrasMap[incomingExtra.id];
      } else {
        const newExtra = await Extra.create({
          name: incomingExtra.name,
          required: incomingExtra.required,
          onlyOne: incomingExtra.onlyOne,
        });
        for (const opt of incomingExtra.options || []) {
          await ExtraOption.create({
            name: opt.name,
            price: opt.price,
            extra_id: newExtra.id,
          });
        }
        await product.addExtra(newExtra);
      }
    }
    for (const extraId in existingExtrasMap) {
      const ex = existingExtrasMap[extraId];
      for (const opt of ex.options || []) await opt.destroy();
      await product.removeExtra(ex);
      await ex.destroy();
    }

    // Manejo de promociones
    if (promotion && Object.keys(promotion).length) {
      const { promotionTypeId, quantity, localId } = promotion;
      if (!promotionTypeId || !quantity || !localId) {
        return res.status(400).json({ message: 'Promotion data is incomplete' });
      }
      let existingPromotion = await Promotion.findOne({ where: { productId: product.id } });
      if (existingPromotion) {
        await existingPromotion.update({ clientId, promotionTypeId, quantity, localId });
      } else {
        await Promotion.create({ clientId, promotionTypeId, productId: product.id, quantity, localId });
      }
    } else {
      await Promotion.destroy({ where: { productId: product.id } });
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product and promotion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function handleOptionsUpdate(existingExtra, incomingOptions) {
  const existingOptions = existingExtra.options || [];
  const existingOptionsMap = existingOptions.reduce((map, option) => {
    map[option.id] = option;
    return map;
  }, {});
  for (const incomingOption of incomingOptions) {
    if (incomingOption.id && existingOptionsMap[incomingOption.id]) {
      const op = existingOptionsMap[incomingOption.id];
      await op.update({ name: incomingOption.name, price: incomingOption.price });
      delete existingOptionsMap[incomingOption.id];
    } else {
      await ExtraOption.create({
        name: incomingOption.name,
        price: incomingOption.price,
        extra_id: existingExtra.id,
      });
    }
  }
  for (const optionId in existingOptionsMap) {
    await existingOptionsMap[optionId].destroy();
  }
}

// =============================
// Obtener productos por local_id
// =============================
export const getByLocalId = async (req, res) => {
  const { id } = req.params;
  const idConfirm = req.user.clientId;

  try {
    const local = await Local.findByPk(id);
    if (!local) return res.status(404).json({ message: "Local not found" });
    if (local.clients_id !== idConfirm) return res.status(403).json({ message: "Forbidden" });

    const categories = await Category.findAll({ where: { local_id: id, state: "1" } });
    const catId = categories.map(cat => cat.id);
    const products = await Product.findAll({ where: { categories_id: { [Op.in]: catId }, state: "1" } });

    const orders = await Order.findAll({ where: { local_id: id, status: 'completed' } });
    const productTotals = {};
    orders.forEach(order => {
      let details;
      try {
        details = typeof order.order_details === 'string'
          ? JSON.parse(order.order_details).details
          : order.order_details.details;
      } catch {
        return;
      }
      details.forEach(detail => {
        if (!productTotals[detail.id]) {
          productTotals[detail.id] = { id: detail.id, name: detail.name, orderCount: 0, totalRevenue: 0 };
        }
        productTotals[detail.id].orderCount += detail.quantity;
        productTotals[detail.id].totalRevenue += detail.quantity *
          parseFloat(detail.price.replace('$', '').replace('.', '').replace(',', '.'));
      });
    });

    const productsWithOrderDetails = products.map(p => ({
      ...p.dataValues,
      orderCount: productTotals[p.id]?.orderCount || 0,
      totalRevenue: productTotals[p.id]?.totalRevenue || 0,
    }));

    res.status(200).json(productsWithOrderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar productos por localId' });
  }
};

// =============================
// Obtener productos por clientId
// =============================
export const getProductsByClientId = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ message: "Client ID is required" });
    const products = await Product.findAll({ where: { clientId: id, state: "1" } });
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
        { model: Extra, as: 'extras', include: [{ model: ExtraOption, as: 'options' }], through: { attributes: [] } },
        { model: Promotion, as: 'promotions', include: [{ model: PromotionType, as: 'promotionType' }] }
      ],
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
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
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    await product.setExtras([]);
    const createdExtras = [];
    for (const extra of extras || []) {
      const { id, name, required, options, onlyOne } = extra;
      let newExtra;
      if (id) {
        newExtra = await Extra.findByPk(id);
        if (newExtra) await newExtra.update({ name, required, onlyOne });
      } else {
        newExtra = await Extra.create({ name, required, onlyOne });
      }
      await ExtraOption.destroy({ where: { extra_id: newExtra.id } });
      for (const opt of options || []) {
        await ExtraOption.create({ name: opt.name, price: opt.price, extra_id: newExtra.id });
      }
      await product.addExtra(newExtra);
      createdExtras.push(newExtra);
    }

    const productWithExtras = await Product.findOne({
      where: { id: productId },
      include: [
        { model: Extra, as: 'extras', include: [{ model: ExtraOption, as: 'options' }], through: { attributes: [] } }
      ],
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
    const workbook = xlsx.read(req.files.file.data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = xlsx.utils.decode_range(sheet['!ref']);
    let startRow = range.s.r;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell = sheet[xlsx.utils.encode_cell({ r: R, c: range.s.c })];
      if (cell && cell.v) { startRow = R; break; }
    }
    const products = xlsx.utils.sheet_to_json(sheet, { range: startRow });
    const createdProducts = [];
    const failedProducts = [];
    for (const pData of products) {
      try {
        const discountPercentage = pData.discountPercentage || 0;
        const price = pData.price || 0;
        const finalPrice = price * (1 - discountPercentage / 100);
        const createdProduct = await Product.create({
          name: pData.name,
          price,
          description: pData.description,
          img: pData.img,
          categories_id: categoryId,
          clientId,
          state: '1',
          discountPercentage,
          finalPrice
        });
        createdProducts.push(createdProduct.name);
      } catch {
        failedProducts.push(pData.name);
      }
    }
    res.status(200).json({ createdProducts, failedProducts });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};

// =============================
// Obtener productos de inventario (discountPercentage = 0)
// =============================
export const getInventoryProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { discountPercentage: 0 } });
    return res.json(products);
  } catch (error) {
    console.error('Error getting inventory products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// =============================
// Actualizar producto de inventario (descuentos y schedules)
// =============================
export const pushInventoryProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { discountPercentage, finalPrice, AlwaysActive = false, discountSchedule = null, categories_id } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.discountPercentage = discountPercentage;
    product.finalPrice = finalPrice;
    product.AlwaysActive = AlwaysActive;
    product.discountSchedule = AlwaysActive ? null : discountSchedule;
    if (categories_id) product.categories_id = categories_id;
    await product.save();

    // Gestionar ProductSchedule
    await ProductSchedule.destroy({ where: { productId } });
    if (!AlwaysActive && Array.isArray(discountSchedule)) {
      for (const { start, end } of discountSchedule) {
        await ProductSchedule.create({ productId, start, end });
      }
    }

    return res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating inventory product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
