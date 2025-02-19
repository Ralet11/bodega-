export default (sequelize, DataTypes) => {
  const ExtraOption = sequelize.define('ExtraOption', {
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    extra_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'extra_options',
    timestamps: false
  });

  ExtraOption.associate = (models) => {
    ExtraOption.belongsTo(models.Extra, { foreignKey: 'extra_id', as: 'extra' });
  };

  return ExtraOption;
};
