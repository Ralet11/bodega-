module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('discounts', 'productName', {
      type: Sequelize.STRING(500),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('discounts', 'productName', {
      type: Sequelize.STRING(45),
      allowNull: false
    });
  }
};