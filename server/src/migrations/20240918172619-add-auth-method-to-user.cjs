
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'authMethod', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'local', // Valor por defecto será 'local' para usuarios ya existentes
    });

    // En caso de querer hacer otros cambios (agregar columnas o actualizar valores, puedes hacerlo aquí)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'authMethod');
  }
};