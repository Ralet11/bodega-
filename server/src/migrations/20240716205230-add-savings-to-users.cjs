module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'savings', {
      type: Sequelize.FLOAT(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'savings');
  }
};