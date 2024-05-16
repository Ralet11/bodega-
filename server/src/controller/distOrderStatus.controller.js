import DistOrderStatus from '../models/distOrderStatus.model.js';

export const createDistOrderStatus = async (req, res) => {
    const { name } = req.body;

    try {
        // Crear un nuevo estado de orden distribuido
        const newDistOrderStatus = await DistOrderStatus.create({
            name: name
        });

        res.status(201).json(newDistOrderStatus);
       
    } catch (error) {
        res.status(500).json({ error: "Error al crear el estado de orden" });
        console.error(error);
    }
};

export const deleteDistOrderStatus = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el estado de orden por su ID y eliminarlo
        const deletedDistOrderStatus = await DistOrderStatus.destroy({
            where: {
                id: id
            }
        });

        if (deletedDistOrderStatus === 0) {
            // Si no se encuentra ningún estado de orden para eliminar
            res.status(404).json({ error: "Estado de orden no encontrado" });
        } else {
            // Si se eliminó correctamente
            res.status(200).json({ message: "Estado de orden eliminado correctamente" });
        }
    } catch (error) {
        // Si ocurre un error durante el proceso de eliminación
        res.status(500).json({ error: "Error al eliminar el estado de orden" });
        console.error(error);
    }
};

export const updateDistOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        // Buscar el estado de orden por su ID y actualizarlo
        const updatedDistOrderStatus = await DistOrderStatus.update(
            { name: name },
            { where: { id: id } }
        );

        if (updatedDistOrderStatus[0] === 0) {
            // Si no se encuentra ningún estado de orden para actualizar
            res.status(404).json({ error: "Estado de orden no encontrado" });
        } else {
            // Si se actualizó correctamente
            res.status(200).json({ message: "Estado de orden actualizado correctamente" });
        }
    } catch (error) {
        // Si ocurre un error durante el proceso de actualización
        res.status(500).json({ error: "Error al actualizar el estado de orden" });
        console.error(error);
    }
};

export const getAllDistOrderStatus = async (req, res) => {
    try {
        // Obtener todos los estados de orden
        const distOrderStatusList = await DistOrderStatus.findAll();

        res.status(200).json(distOrderStatusList);
    } catch (error) {
        // Si ocurre un error durante el proceso de obtención
        res.status(500).json({ error: "Error al obtener los estados de orden" });
        console.error(error);
    }
};

export const getDistOrderStatusById = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el estado de orden por su ID
        const distOrderStatus = await DistOrderStatus.findByPk(id);

        if (!distOrderStatus) {
            // Si no se encuentra el estado de orden
            res.status(404).json({ error: "Estado de orden no encontrado" });
        } else {
            // Si se encuentra, responder con el estado de orden
            res.status(200).json(distOrderStatus);
        }
    } catch (error) {
        // Si ocurre un error durante el proceso
        res.status(500).json({ error: "Error al obtener el estado de orden" });
        console.error(error);
    }
};