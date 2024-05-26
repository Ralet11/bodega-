module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('balance_requests', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('balance_requests', 'date');
  }
};