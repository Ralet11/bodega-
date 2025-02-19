export default (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    delivery_fee: {
      type: DataTypes.FLOAT,
      defaultValue: null
    },
    total_price: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    order_details: {
      type: DataTypes.JSON,
      allowNull: false
    },
    local_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'local', // Nombre exacto de la tabla relacionada
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Nombre exacto de la tabla relacionada
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    status: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    deliveryInstructions: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'orders',
    timestamps: false
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'users_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Order.belongsTo(models.Local, {
      foreignKey: 'local_id',
      as: 'local',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Order.hasMany(models.OrderProduct, {
      foreignKey: 'order_id',
      as: 'orderProducts'
    });
  };

  return Order;
};
