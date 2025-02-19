export default (sequelize, DataTypes) => {
  const ShopOpenHours = sequelize.define('ShopOpenHours', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    local_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    day: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    open_hour: {
      type: DataTypes.TIME,
      allowNull: false
    },
    close_hour: {
      type: DataTypes.TIME,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ShopOpenHours',
    timestamps: true
  });

  ShopOpenHours.associate = (models) => {
    ShopOpenHours.belongsTo(models.Local, { foreignKey: 'local_id', as: 'local' });
  };

  return ShopOpenHours;
};
