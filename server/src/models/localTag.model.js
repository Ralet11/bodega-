export default (sequelize, DataTypes) => {
  const LocalTag = sequelize.define('LocalTag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    local_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'local_tag',
    timestamps: false
  });

  LocalTag.associate = (models) => {
    LocalTag.belongsTo(models.Tag, { foreignKey: 'tag_id', as: 'tag' });
    LocalTag.belongsTo(models.Local, { foreignKey: 'local_id', as: 'local' });
  };

  return LocalTag;
};
