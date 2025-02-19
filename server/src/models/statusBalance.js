export default (sequelize, DataTypes) => {
  const StatusBalance = sequelize.define('StatusBalance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'status_balances',
    timestamps: false
  });

  StatusBalance.associate = (models) => {
    StatusBalance.hasMany(models.BalanceRequest, { foreignKey: 'statusBalance_id' });
  };

  return StatusBalance;
};
