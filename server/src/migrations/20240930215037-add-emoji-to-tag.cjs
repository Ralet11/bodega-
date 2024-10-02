module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tag', 'emoji', {
      type: Sequelize.STRING,
      allowNull: true,  // Este campo es opcional
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tag', 'emoji');
  },
}