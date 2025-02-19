export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
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
    // Eliminado local_category_id
    img: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    emoji: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'tag',
    timestamps: false
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Local, {
      through: models.LocalTag,
      foreignKey: 'tag_id',
      as: 'locals'
    });
  };

  return Tag;
};
