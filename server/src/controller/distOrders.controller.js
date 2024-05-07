import DistOrderProduct from "../models/distOrderProduct.model.js";
import DistOrder from "../models/distOrders.model.js";
import DistProduct from "../models/distProducts.model.js";

export const addToLocal = async (req, res) => {
    console.log(req.body);
    const { local_id, order_details, order_date } = req.body;
    try {
        // Crear la orden
        const newOrder = await DistOrder.create({
            order_date,
            local_id
        });

        const orderId = newOrder.id;

        console.log(orderId, "orderid")

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
                    attributes: ['id', 'order_date', 'local_id'],
                },
                {
                    model: DistProduct
                }
            ]
        });
        console.log(orderProducts, "respuesta")
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