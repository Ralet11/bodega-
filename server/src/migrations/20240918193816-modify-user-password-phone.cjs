'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modificar la columna `password` para permitir valores nulos
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(130),
      allowNull: true, // Permitir que sea null para usuarios que se registren con Google
    });

    // Modificar la columna `phone` para permitir valores nulos
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(45),
      allowNull: true, // Permitir que sea null para usuarios que se registren con Google
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir el cambio en la columna `password` para no permitir valores nulos
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(130),
      allowNull: false,
    });

    // Revertir el cambio en la columna `phone` para no permitir valores nulos
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(45),
      allowNull: false,
    });
  }
};
