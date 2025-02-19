export default (sequelize, DataTypes) => {
  const BalanceRequest = sequelize.define('BalanceRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    statusBalance_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'balance_requests',
    timestamps: false
  });

  BalanceRequest.associate = (models) => {
    BalanceRequest.belongsTo(models.Client, { foreignKey: 'client_id' });
    BalanceRequest.belongsTo(models.StatusBalance, { foreignKey: 'statusBalance_id' });
  };

  return BalanceRequest;
};
