export default (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    adressID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    formatted_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    houseNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    streetName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    additionalDetails: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'adresses',
    timestamps: false
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: 'users_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Address;
};
