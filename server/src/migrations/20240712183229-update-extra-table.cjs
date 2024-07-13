'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('extras', 'option1');
    await queryInterface.removeColumn('extras', 'option2');
    await queryInterface.removeColumn('extras', 'option3');
    await queryInterface.removeColumn('extras', 'option4');
    await queryInterface.removeColumn('extras', 'option5');
    await queryInterface.removeColumn('extras', 'option6');
    await queryInterface.removeColumn('extras', 'option7');
    await queryInterface.removeColumn('extras', 'option8');
    await queryInterface.removeColumn('extras', 'option9');
    await queryInterface.removeColumn('extras', 'option10');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('extras', 'option1', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option2', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option3', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option4', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option5', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option6', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option7', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option8', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option9', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('extras', 'option10', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
