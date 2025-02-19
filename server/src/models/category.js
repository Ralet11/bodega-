

export default (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
    img: {
      type: DataTypes.STRING(45),
      defaultValue: null
    },
    local_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      defaultValue: null
    }
  }, {
    tableName: 'categories',
    timestamps: false
  });

  Category.associate = (models) => {
    // Category N:1 Local
    Category.belongsTo(models.Local, {
      foreignKey: 'local_id',
      as: 'local'
    });
  };

  return Category;
};
