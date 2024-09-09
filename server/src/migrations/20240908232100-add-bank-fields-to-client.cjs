module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('clients', 'account_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('clients', 'account_holder_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('clients', 'routing_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('clients', 'account_number');
    await queryInterface.removeColumn('clients', 'account_holder_name');
    await queryInterface.removeColumn('clients', 'routing_number');
  }
};