'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      delivery_fee: {
        type: Sequelize.FLOAT,
        defaultValue: null
      },
      total_price: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      order_details: {
        type: Sequelize.JSON,
        allowNull: false
      },
      local_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        references: {
          model: 'locals', // Asegúrate de que la tabla 'locals' exista y esté correctamente referenciada
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      status: {
        type: Sequelize.STRING(255),
        defaultValue: null
      },
      date_time: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(6),
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};
