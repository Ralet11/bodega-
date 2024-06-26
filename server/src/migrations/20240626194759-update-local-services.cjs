module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('local', 'service_options');
    
    await queryInterface.addColumn('local', 'delivery', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn('local', 'pickUp', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn('local', 'orderIn', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('local', 'service_options', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: ["0", "1"],
    });

    await queryInterface.removeColumn('local', 'delivery');
    await queryInterface.removeColumn('local', 'pickUp');
    await queryInterface.removeColumn('local', 'orderIn');
  }
};