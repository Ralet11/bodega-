import Category from '../models/category.js';
import Product from '../models/product.js';
import { Op } from 'sequelize';
import Local from '../models/local.js';
import Order from '../models/order.js';
import Extra from '../models/extra.js';
import ProductExtra from '../models/productextra.js';
import xlsx from 'xlsx';
import ExtraOption from '../models/extraOption.model.js';

export const getByCategoryId = async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Busca productos por categoría y estado utilizando el modelo Product
    const products = await Product.findAll({
      where: {
        categories_id: categoryId,
        state: "1" // Considera solo productos activos
      },
      include: {
        model: Extra,
        as: 'extras',
        include: {
          model: ExtraOption,
          as: 'options' // Esto asume que has definido la relación con alias 'options' en Extra
        },
        through: { attributes: [] } // Esto excluye los atributos de la tabla intermedia (productExtras)
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error al consultar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, description, img, category_id, extras } = req.body;
  const clientId = req.user.clientId;

  console.log(extras);
  console.log(req.body);

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

export const updateById = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    // Actualiza el producto utilizando el modelo Product
    await Product.update({
      name,
      price,
      description
    }, {
      where: {
        id
      }
    });

    console.log(`Producto ${id} actualizado con éxito`);
    res.status(200).json("Producto actualizado correctamente");
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const getByLocalId = async (req, res) => {
  const { id } = req.params;
  const idConfirm = req.user.clientId; // El clientId del usuario autenticado
  console.log(id);

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

    console.log('Products with Order Details:', productsWithOrderDetails);
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
  const {id} = req.body
  try {
    const product = await Product.findByPk(id)
    res.status(200).json(product)
  } catch (error) {
   res.status(500).json(error)
   console.log(error) 
  }
}




export const saveExtras = async (req, res) => {
  const { extras, productId } = req.body;
  console.log(req.body);

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
      const { id, name, required, options } = extra; // options es un array de { name, price }

      let newExtra;

      if (id) {
        // Si el extra ya existe, actualizarlo
        newExtra = await Extra.findByPk(id);
        if (newExtra) {
          await newExtra.update({
            name,
            required
          });
        }
      } else {
        // Si el extra no existe, crearlo
        newExtra = await Extra.create({
          name,
          required
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