export default (sequelize, DataTypes) => {
  const PayMethod = sequelize.define('PayMethod', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(200),
      defaultValue: null
    }
  }, {
    tableName: 'pay_methods',
    timestamps: false
  });

  PayMethod.associate = (models) => {
    // Si requieres la inversa con ClientPaymentDetail, podrías hacer:
    // PayMethod.hasMany(models.ClientPaymentDetail, { foreignKey: 'pay_method_id' });
  };

  return PayMethod;
};
