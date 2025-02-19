export default (sequelize, DataTypes) => {
  const ClientPaymentDetail = sequelize.define('ClientPaymentDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permite nulos si es necesario
      references: {
        model: 'clients',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    pay_method_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permite nulos si es necesario
      references: {
        model: 'pay_methods',
        key: 'id',
      },
      onDelete: 'SET NULL', // O 'CASCADE' si prefieres
      onUpdate: 'CASCADE',
    },
    secret_key: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    publishable_key: {
      type: DataTypes.STRING(245),
      defaultValue: null
    }
  }, {
    tableName: 'client_payment_details',
    timestamps: false
  });

  ClientPaymentDetail.associate = (models) => {
    ClientPaymentDetail.belongsTo(models.Client, {
      foreignKey: 'client_id',
      as: 'client',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    ClientPaymentDetail.belongsTo(models.PayMethod, {
      foreignKey: 'pay_method_id',
      as: 'pay_method',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return ClientPaymentDetail;
};
