module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar el estado actual de la tabla
    const table = await queryInterface.describeTable('user_promotions');

    // Agregar `localId` si no existe
    if (!table.localId) {
      await queryInterface.addColumn('user_promotions', 'localId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'local',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }

    // Agregar `rewardCount` si no existe
    if (!table.rewardCount) {
      await queryInterface.addColumn('user_promotions', 'rewardCount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    // Eliminar `promotionId` si existe
    if (table.promotionId) {
      await queryInterface.removeColumn('user_promotions', 'promotionId');
    }

    // Eliminar `rewardReceived` si existe
    if (table.rewardReceived) {
      await queryInterface.removeColumn('user_promotions', 'rewardReceived');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('user_promotions');

    // Revertir los cambios solo si es necesario
    if (!table.promotionId) {
      await queryInterface.addColumn('user_promotions', 'promotionId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'promotions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }

    if (!table.rewardReceived) {
      await queryInterface.addColumn('user_promotions', 'rewardReceived', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (table.localId) {
      await queryInterface.removeColumn('user_promotions', 'localId');
    }

    if (table.rewardCount) {
      await queryInterface.removeColumn('user_promotions', 'rewardCount');
    }
  },
};