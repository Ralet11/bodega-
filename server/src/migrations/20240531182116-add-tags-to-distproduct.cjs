module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('DistProducts', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('DistProducts', 'tags');
  },
};