module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('discounts', 'image', 'img');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('discounts', 'img', 'image');
  }
};