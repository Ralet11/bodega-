module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('local', 'ratingCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('local', 'ratingSum');
    await queryInterface.removeColumn('local', 'ratingCount');
  }
};