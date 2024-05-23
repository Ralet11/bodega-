'use strict';
const defaultImageUrl = 'https://via.placeholder.com/300';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('local', 'img', {
      type: Sequelize.STRING(255),
      defaultValue: defaultImageUrl,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('local', 'img', {
      type: Sequelize.STRING(255),
      defaultValue: null,
      allowNull: true,
    });
  }
};
