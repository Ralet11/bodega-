module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('local', 'service_options', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: ["0", "1"] // Valor por defecto actualizado
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('local', 'service_options', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [] // Valor por defecto anterior
    });
  }
};