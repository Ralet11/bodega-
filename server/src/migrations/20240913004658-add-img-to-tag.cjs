module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tag', 'img', {
      type: Sequelize.STRING,
      allowNull: true, // Puedes cambiar a false si quieres que este campo sea obligatorio
      defaultValue: null, // Puedes poner un valor por defecto si lo deseas
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tag', 'img');
  }
};