export default (sequelize, DataTypes) => {
  const Extra = sequelize.define('Extra', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    onlyOne: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'extras',
    timestamps: false
  });

  Extra.associate = (models) => {
    Extra.hasMany(models.ExtraOption, { foreignKey: 'extra_id', as: 'options' });
    Extra.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return Extra;
};
