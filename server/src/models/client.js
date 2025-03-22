export default (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
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
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null
    },
    pay_methods: {
      type: DataTypes.JSON,
      defaultValue: null
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    account_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    account_holder_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null
    },
    routing_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    tutorialComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    resetCode: {
      type: DataTypes.STRING(6),
      allowNull: true,
      defaultValue: null
    },
    resetCodeExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 // 0: dueños de locales, 1: vendedores
    },
    referencedCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    ssn: {
      type: DataTypes.STRING(9),
      allowNull: true,
      defaultValue: null
    },
    idNumber: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null
    },
    affiliatedSellerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'clients', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    stripe_account_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'clients',
    timestamps: false
  });

  Client.associate = (models) => {
    Client.hasMany(models.BalanceRequest, { foreignKey: 'client_id' });
    Client.hasMany(models.ClientPaymentDetail, { foreignKey: 'client_id' });
    Client.hasMany(models.Local, { foreignKey: 'clients_id', as: 'locals' });
    Client.hasMany(models.Promotion, { foreignKey: 'clientId', as: 'promotions' });
    Client.belongsTo(models.Client, { foreignKey: 'affiliatedSellerId', as: 'seller' });
  };

  return Client;
};
