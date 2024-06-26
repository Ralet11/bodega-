module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('local', 'service_options', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [] // Valor por defecto como un array vacío
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('local', 'service_options');
  }
};