module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('discounts', 'delivery', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1, 2]]
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('discounts', 'delivery');
  }
};