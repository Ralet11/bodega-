module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('DistProducts', 'brand_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'brands',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('DistProducts', 'brand_id');
  }
};