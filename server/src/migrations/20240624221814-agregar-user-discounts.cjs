module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_discounts', 'used', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_discounts', 'used');
  }
};