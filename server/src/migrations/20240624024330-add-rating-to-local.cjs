module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('local', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0.00,
        max: 5.00
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('local', 'rating');
  }
};