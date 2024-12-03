import Category from '../models/category.js';
import Product from '../models/product.js';
import { Op } from 'sequelize';
import Local from '../models/local.js';
import Order from '../models/order.js';
import Extra from '../models/extra.js';
import ProductExtra from '../models/productextra.js';
import xlsx from 'xlsx';
import ExtraOption from '../models/extraOption.model.js';
import Discount from '../models/discount.js';
import Promotion from '../models/promotions.model.js';
import PromotionType from '../models/promotionType.js';

export const getByCategoryId = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const products = await Product.findAll({
      where: {
        categories_id: categoryId,
        state: "1", // Only active products
      },
      include: [
        {
          model: Extra,
          as: 'extras',
          include: {
            model: ExtraOption,
            as: 'options',
          },
          through: { attributes: [] },
        },
        {
          model: Discount,
          as: 'discounts',
          required: false,
        },
        // Include promotions
        {
          model: Promotion,
          as: 'promotions',
          include: [
            {
              model: PromotionType,
              as: 'promotionType',
            },
          ],
          required: false, // Include products even if they don't have promotions
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const addProduct = async (req, res) => {
  const { name, price, description, img, category_id, extras } = req.body;
  const clientId = req.user.clientId;



  try {
    // Crea un nuevo producto utilizando el modelo Product
    const newProduct = await Product.create({
      name,
      price,
      description,
      img: `${img}`,
      categories_id: category_id,
      state: 1,
      clientId
    });

    // Array para almacenar los extras creados para la respuesta
    const createdExtras = [];

    // Iterar sobre cada extra y crear las entradas correspondientes
    for (const extra of extras) {
      const { name, options, required } = extra;

      // Crea el extra
      const newExtra = await Extra.create({
        name,
        required
      });

      // Crear opciones para el extra
      for (const option of options) {
        await ExtraOption.create({
          name: option.name,
          price: option.price,
          extra_id: newExtra.id
        });
      }

      // Crea la relación ProductExtra
      await ProductExtra.create({
        productId: newProduct.id,
        extraId: newExtra.id
      });

      // Agregar el extra creado al array
      createdExtras.push(newExtra);
    }

    // Recupera el nuevo producto con sus extras para la respuesta
    const productWithExtras = await Product.findOne({
      where: { id: newProduct.id },
      include: {
        model: Extra,
        as: 'extras',
        include: {
          model: ExtraOption,
          as: 'options' // Esto asume que has definido la relación con alias 'options'
        },
        through: { attributes: [] }
      }
    });

    res.status(201).json(productWithExtras);
  } catch (error) {
    console.error('Error al añadir producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    // Actualiza el estado del producto a 0 para marcarlo como inactivo
    await Product.update({ state: 0 }, {
      where: {
        id
      }
    });

    console.log(`Producto eliminado: ${id}`);
    res.status(200).json("Producto eliminado correctamente");
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// controllers/productController.js

  // controllers/productController.js

  export const updateProductAndDiscount = async (req, res) => {
    const {
      productId,
      name,
      price,
      description,
      img,
      category_id,
      extras,
      discount,
      promotion, // Include promotion data from the request body
    } = req.body;
  
    const clientId = req.user.clientId; // Assuming you have middleware that sets req.user.clientId
  
    try {
      // Fetch the product with its associated models
      const product = await Product.findByPk(productId, {
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
          {
            model: Discount,
            as: 'discounts',
          },
          {
            model: Promotion,
            as: 'promotions', // Use 'promotions' as per your association
          },
        ],
      });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Verify product ownership
      if (product.clientId !== clientId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      // Update product details
      await product.update({
        name,
        price,
        description,
        img,
        categories_id: category_id,
      });
  
      // Handle modifiers (extras)
      const existingExtras = product.extras || [];
      const incomingExtras = extras || [];
  
      // Map existing extras for easy access
      const existingExtrasMap = existingExtras.reduce((map, extra) => {
        map[extra.id] = extra;
        return map;
      }, {});
  
      // Process incoming extras
      for (const incomingExtra of incomingExtras) {
        if (incomingExtra.id) {
          // Existing extra - update it
          const existingExtra = existingExtrasMap[incomingExtra.id];
          if (existingExtra) {
            await existingExtra.update({
              name: incomingExtra.name,
              required: incomingExtra.required,
              onlyOne: incomingExtra.onlyOne,
            });
  
            // Handle options for this extra
            await handleOptionsUpdate(
              existingExtra,
              incomingExtra.options || []
            );
  
            // Remove from map after processing
            delete existingExtrasMap[incomingExtra.id];
          }
        } else {
          // New extra - create it
          const newExtra = await Extra.create({
            name: incomingExtra.name,
            required: incomingExtra.required,
            onlyOne: incomingExtra.onlyOne,
          });
  
          // Create options for the new extra
          for (const option of incomingExtra.options || []) {
            await ExtraOption.create({
              name: option.name,
              price: option.price,
              extra_id: newExtra.id,
            });
          }
  
          // Associate the new extra with the product
          await ProductExtra.create({
            productId: product.id,
            extraId: newExtra.id,
          });
        }
      }
  
      // Delete extras not present in incoming data
      for (const extraId in existingExtrasMap) {
        const extraToDelete = existingExtrasMap[extraId];
  
        // Delete associated options
        for (const option of extraToDelete.options) {
          await option.destroy();
        }
  
        // Delete association and extra
        await ProductExtra.destroy({
          where: {
            productId: product.id,
            extraId: extraId,
          },
        });
        await extraToDelete.destroy();
      }
  
      // Update the associated discount
      if (discount && discount.discountId) {
        const existingDiscount = await Discount.findByPk(discount.discountId);
  
        if (!existingDiscount) {
          return res.status(404).json({ error: 'Discount not found' });
        }
  
        // Verify discount ownership
        const local = await Local.findByPk(existingDiscount.local_id);
  
        if (!local || local.clients_id !== clientId) {
          return res
            .status(403)
            .json({ message: 'Forbidden. Client ID does not match.' });
        }
  
        // Update discount details
        await existingDiscount.update({
          productName: discount.productName,
          limitDate: discount.limitDate,
          percentage: discount.percentage === '' ? null : discount.percentage,
          fixedValue: discount.fixedValue === '' ? null : discount.fixedValue,
          order_details: {
            name,
            price,
            description,
            category_id,
          },
          product_id: product.id,
          category_id,
          description: discount.description,
          discountType: discount.discountType,
          delivery: discount.delivery,
          active: discount.active,
          usageLimit: discount.usageLimit === '' ? null : discount.usageLimit,
          minPurchaseAmount:
            discount.minPurchaseAmount === ''
              ? null
              : discount.minPurchaseAmount,
          maxDiscountAmount:
            discount.maxDiscountAmount === ''
              ? null
              : discount.maxDiscountAmount,
          conditions: discount.conditions,
        });
      }
  
      // Handle promotion creation, update, or deletion
      if (promotion && Object.keys(promotion).length > 0) {
        // Promotion data is provided, proceed to create/update promotion
        const { promotionTypeId, quantity, localId } = promotion;
  
        // Validate required fields
        if (!promotionTypeId || !quantity || !localId) {
          return res.status(400).json({ message: 'Promotion data is incomplete' });
        }
  
        // Use clientId from req.user.clientId
        // productId is already known (product.id)
  
        // Check if a promotion already exists for this product
        let existingPromotion = await Promotion.findOne({
          where: { productId: product.id },
        });
  
        if (existingPromotion) {
          // Update existing promotion
          await existingPromotion.update({
            clientId,
            promotionTypeId,
            quantity,
            localId,
          });
        } else {
          // Create new promotion
          await Promotion.create({
            clientId,
            promotionTypeId,
            productId: product.id,
            quantity,
            localId,
          });
        }
      } else {
        // No promotion data provided, delete any existing promotion
        await Promotion.destroy({
          where: { productId: product.id },
        });
      }
  
      res.status(200).json({
        message: 'Product, discount, and promotion updated successfully',
      });
    } catch (error) {
      console.error('Error updating product, discount, and promotion:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  // Función auxiliar para manejar la actualización de opciones de un extra
  async function handleOptionsUpdate(existingExtra, incomingOptions) {
    const existingOptions = existingExtra.options || [];
  
    // Mapear opciones existentes para fácil acceso
    const existingOptionsMap = existingOptions.reduce((map, option) => {
      map[option.id] = option;
      return map;
    }, {});
  
    // Procesar opciones entrantes
    for (const incomingOption of incomingOptions) {
      if (incomingOption.id) {
        // Opción existente - actualizarla
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
        // Nueva opción - crearla
        await ExtraOption.create({
          name: incomingOption.name,
          price: incomingOption.price,
          extra_id: existingExtra.id,
        });
        console.log(`New option created: ${incomingOption.name}`);
      }
    }
  
    // Eliminar opciones no presentes en los datos entrantes
    for (const optionId in existingOptionsMap) {
      const optionToDelete = existingOptionsMap[optionId];
      await optionToDelete.destroy();
      console.log(`Deleted option: ${optionToDelete.name}`);
    }
  }
  



export const getByLocalId = async (req, res) => {
  const { id } = req.params;
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado


  try {
    // Buscar el local para verificar el clientId
    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ message: "Local not found" });
    }

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ message: "Forbidden. Client ID does not match." });
    }

    // Obtener las categorías activas asociadas al local
    const categories = await Category.findAll({
      where: {
        local_id: id,
        state: "1"
      }
    });

    let catId = categories.map(cat => cat.id);

    // Obtener los productos asociados a las categorías activas
    const products = await Product.findAll({
      where: {
        categories_id: {
          [Op.in]: catId // Utilizamos el operador "in" para buscar en un array de IDs
        },
        state: "1" // Considera solo productos activos
      }
    });

    // Obtener las órdenes asociadas a este local
    const orders = await Order.findAll({
      where: {
        local_id: id,
        status: 'completed' // Solo órdenes completadas
      }
    });

    // Crear un objeto para agrupar los productos y calcular los totales
    const productTotals = {};

    orders.forEach(order => {
      let orderDetails;

      // Verifica si order.order_details es una cadena o un objeto
      if (typeof order.order_details === 'string') {
        try {
          orderDetails = JSON.parse(order.order_details).details;
        } catch (err) {
          console.error('Error parsing order details:', err);
          return; // Salir del foreach para este pedido específico
        }
      } else {
        orderDetails = order.order_details.details;
      }

      // Iterar sobre los detalles del pedido
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
        productTotals[detail.id].totalRevenue += detail.quantity * parseFloat(detail.price.replace('$', '').replace('.', '').replace(',', '.'));
      });
    });

    // Mapear los productos originales para incluir los totales calculados
    const productsWithOrderDetails = products.map(product => ({
      ...product.dataValues,
      orderCount: productTotals[product.id] ? productTotals[product.id].orderCount : 0,
      totalRevenue: productTotals[product.id] ? productTotals[product.id].totalRevenue : 0
    }));

    
    res.status(200).json(productsWithOrderDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al buscar productos por IDs locales' });
  }
};


export const getProductsByClientId = async (req, res) => {
  const { id } = req.params; // Obtener el clientId de los parámetros de la ruta

  try {
    // Verificar si el clientId está presente en la consulta
    if (!id) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    // Obtener los productos asociados al clientId
    const products = await Product.findAll({
      where: {
        clientId: id,
        state: "1" // Considera solo productos activos
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by client ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getByProductId = async (req, res) => {
  const { id } = req.params; // Use req.params for GET requests

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
        {
          model: Discount,
          as: 'discounts',
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




export const saveExtras = async (req, res) => {
  const { extras, productId } = req.body;


  try {
    // Verificar si el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar las relaciones existentes en ProductExtra
    await ProductExtra.destroy({
      where: { productId }
    });

    // Crear un array para almacenar los extras creados
    const createdExtras = [];

    // Iterar sobre los extras recibidos para crear/actualizar
    for (const extra of extras) {
      const { id, name, required, options, onlyOne } = extra; // options es un array de { name, price }

      let newExtra;

      if (id) {
        // Si el extra ya existe, actualizarlo
        newExtra = await Extra.findByPk(id);
        if (newExtra) {
          await newExtra.update({
            name,
            required,
            onlyOne
          });
        }
      } else {
        // Si el extra no existe, crearlo
        newExtra = await Extra.create({
          name,
          required,
          onlyOne
        });
      }

      // Eliminar las opciones existentes para este extra
      await ExtraOption.destroy({
        where: { extra_id: newExtra.id }
      });

      // Crear nuevas opciones para este extra
      for (const option of options) {
        await ExtraOption.create({
          name: option.name,
          price: option.price,
          extra_id: newExtra.id
        });
      }

      // Crear la relación ProductExtra
      await ProductExtra.create({
        productId,
        extraId: newExtra.id
      });

      // Agregar el extra creado/actualizado al array
      createdExtras.push(newExtra);
    }

    // Recuperar el producto con sus extras actualizados
    const productWithExtras = await Product.findOne({
      where: { id: productId },
      include: {
        model: Extra,
        as: 'extras',
        include: {
          model: ExtraOption,
          as: 'options' // Esto asume que has definido la relación con alias 'options'
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

      // Encuentra la primera fila con datos
      const range = xlsx.utils.decode_range(sheet['!ref']);
      let startRow = range.s.r; // Fila de inicio
      for (let R = range.s.r; R <= range.e.r; ++R) {
          let cell = sheet[xlsx.utils.encode_cell({ r: R, c: range.s.c })];
          if (cell && cell.v) {
              startRow = R;
              break;
          }
      }

      // Convierte la hoja en un objeto JSON comenzando desde la fila detectada
      const products = xlsx.utils.sheet_to_json(sheet, { range: startRow });

      let createdProducts = [];
      let failedProducts = [];

      for (const product of products) {
          try {
              const createdProduct = await Product.create({
                  name: product.name,
                  price: product.price,
                  description: product.description,
                  img: product.img,
                  categories_id: categoryId,
                  clientId: clientId,
                  state: '1'  // Estado por defecto
              });
              createdProducts.push(createdProduct.name);
          } catch (error) {
              console.error('Error creating product:', product.name, error);
              failedProducts.push(product.name);
          }
      }

      res.status(200).json({
          createdProducts: createdProducts,
          failedProducts: failedProducts
      });
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
  }
};