module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('extras', 'onlyOne', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('extras', 'onlyOne');
  }
};