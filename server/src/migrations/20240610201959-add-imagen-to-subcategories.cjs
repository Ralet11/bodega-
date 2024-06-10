module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subcategories', 'imagen', {
      type: Sequelize.STRING(600),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subcategories', 'imagen');
  }
};