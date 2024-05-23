const defaultImageUrl = 'https://via.placeholder.com/300';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('products', 'img', {
      type: Sequelize.STRING(255),
      defaultValue: defaultImageUrl,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('products', 'img', {
      type: Sequelize.STRING(45),
      allowNull: false,
    });
  }
};