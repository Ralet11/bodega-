import DistOrderProduct from "../models/distOrderProduct.model.js";
import DistOrder from "../models/distOrders.model.js";
import DistProduct from "../models/distProducts.model.js";
import DistOrderStatus from "../models/distOrderStatus.model.js"; // Importar el modelo
import Local from "../models/local.js";
import Client from "../models/client.js";

export const addToLocal = async (req, res) => {
  console.log(req.body);
  const { local_id, order_details, order_date } = req.body;
  const idConfirm = req.user.clientId;

  try {
      // Buscar el local para verificar el clientId
      const local = await Local.findByPk(local_id);

      if (!local) {
          return res.status(404).json({ message: "Local not found" });
      }

      if (local.clients_id !== idConfirm) {
          return res.status(403).json({ message: "Forbidden. Client ID does not match." });
      }

      // Crear la orden con status_id por defecto 1
      const newOrder = await DistOrder.create({
          order_date,
          local_id,
          status_id: 1 // Establece el status_id a 1 por defecto
      });

      const orderId = newOrder.id;
      console.log(orderId, "orderid");

      // Agrupar orderDetails por ID y contar la cantidad de cada uno
      const itemQuantities = order_details.reduce((acc, detail) => {
          acc[detail.id] = acc[detail.id] ? acc[detail.id] + 1 : 1;
          return acc;
      }, {});

      // Crear los registros de DistOrderProduct
      let ids = [];
      for (const detail of order_details) {
          if (!ids.includes(detail.id)) {
              // Si el ID no está en la lista, crea un nuevo registro
              await DistOrderProduct.create({
                  order_id: orderId,
                  product_id: detail.id,
                  quantity: itemQuantities[detail.id] || 1 // Puedes establecer una cantidad predeterminada si es necesario
              });
              // Agrega el ID a la lista para evitar duplicados
              ids.push(detail.id);
          }
      }

      // Buscar los detalles de los productos de la orden recién creada
      const orderProducts = await DistOrderProduct.findAll({
          where: { order_id: orderId },
          include: [
              {
                  model: DistOrder,
                  attributes: ['id', 'order_date', 'local_id', 'status_id'],
                  include: [
                      {
                          model: DistOrderStatus, // Incluir el modelo DistOrderStatus
                          attributes: ['name'] // Solo obtener el campo 'name'
                      }
                  ]
              },
              {
                  model: DistProduct
              }
          ]
      });

      console.log(orderProducts, "respuesta");
      res.status(201).json(orderProducts);
  } catch (error) {
      console.error("Error adding order:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrder = async (req, res) => {
    const { id, order_date } = req.body;
    try {
        const existingOrder = await DistOrder.findByPk(id);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (existingOrder.order_date === order_date) {
            return res.status(200).json({ message: "Order is already up to date" });
        }

        await DistOrder.update(
            { order_date: order_date },
            { where: { id: id } }
        );

        res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateOrderProduct = async (req, res) => {
    const { id, quantity } = req.body;
    try {
        const existingOrderProduct = await DistOrderProduct.findByPk(id);
        if (!existingOrderProduct) {
            return res.status(404).json({ error: "Order product not found" });
        }

        if (existingOrderProduct.quantity === quantity) {
            return res.status(200).json({ message: "Order product quantity is already up to date" });
        }

        await DistOrderProduct.update(
            { quantity: quantity },
            { where: { id: id } }
        );

        res.status(200).json({ message: "Order product updated successfully" });
    } catch (error) {
        console.error("Error updating order product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getByLocalId = async (req, res) => {
  const { local_id } = req.body;
  const idConfirm = req.user.clientId;

  try {
    const local = await Local.findByPk(local_id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email'] // Ajusta los atributos según tu modelo Client
        }
      ]
    });

    if (!local) {
      return res.status(404).json({ error: "Local not found" });
    }

    if (local.clients_id !== idConfirm) {
      return res.status(403).json({ error: "Forbidden. Client ID does not match." });
    }

    const orders = await DistOrder.findAll({
      where: { local_id },
      include: [
        {
          model: DistOrderStatus,
          attributes: ['name']
        },
        {
          model: DistOrderProduct,
          include: [
            {
              model: DistProduct
            }
          ]
        }
      ]
    });

    // Procesar las órdenes para calcular el total
    const finalOrders = await Promise.all(orders.map(async (order) => {
      // Calcular el total de la orden
      let finalTotal = 0;
      await Promise.all(order.distOrderProducts.map(async (prod) => {
        finalTotal += prod.DistProduct.price * prod.quantity;
      }));

      // Retornar los detalles de la orden
      return {
        id: order.id,
        date: order.order_date,
        status: order.distOrderStatus.name, // Usar el nombre del estado
        products: order.distOrderProducts,
        total: finalTotal
      };
    }));

    res.status(200).json(finalOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};