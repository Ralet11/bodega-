import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import DistOrderProduct from './distOrderProduct.model.js';
import DistOrderStatus from './distOrderStatus.model.js'; // Importando el modelo DistOrderStatus

const DistOrder = sequelize.define('distOrder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    local_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status_id: { // Clave externa hacia DistOrderStatus
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DistOrderStatus, // Referencia al modelo DistOrderStatus
            key: 'id' // Campo en el modelo DistOrderStatus que está siendo referenciado
        }
    }
}, {
    tableName: 'distOrders',
    timestamps: false
});

DistOrder.belongsTo(DistOrderStatus, { foreignKey: 'status_id' }); // Definiendo la relación

DistOrder.hasMany(DistOrderProduct, { foreignKey: 'order_id' });
DistOrderProduct.belongsTo(DistOrder, { foreignKey: 'order_id' });

export default DistOrder;
