module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('local', 'ratingSum', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.00
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('local', 'ratingSum');
  }
};