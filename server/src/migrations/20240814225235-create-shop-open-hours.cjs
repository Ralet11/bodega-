'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShopOpenHours', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      local_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'local', // Nombre de la tabla relacionada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      day: {
        type: Sequelize.STRING(15), // Suficiente para nombres de días como 'Monday'
        allowNull: false
      },
      open_hour: {
        type: Sequelize.TIME, // Formato adecuado para almacenar horas
        allowNull: false
      },
      close_hour: {
        type: Sequelize.TIME, // Formato adecuado para almacenar horas
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ShopOpenHours');
  }
};
