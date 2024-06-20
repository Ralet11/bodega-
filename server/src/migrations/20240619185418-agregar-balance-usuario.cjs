module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'balance', {
      type: Sequelize.FLOAT(10, 2), // Precision of 10 digits, 2 of which are decimal
      allowNull: false,
      defaultValue: 0.00,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'balance');
  }
};