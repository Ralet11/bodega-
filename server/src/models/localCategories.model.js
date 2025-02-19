// models/LocalCategory.js

export default (sequelize, DataTypes) => {
  const LocalCategory = sequelize.define('LocalCategory', {
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
      type: DataTypes.STRING(255),
      defaultValue: null
    }
  }, {
    tableName: 'locals_categories',
    timestamps: false
  });

  LocalCategory.associate = (models) => {
    LocalCategory.hasMany(models.Local, {
      foreignKey: 'locals_categories_id',
      as: 'locals'
    });
  };

  return LocalCategory;
};  