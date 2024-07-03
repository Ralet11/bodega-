module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add the new column allowing null values
    await queryInterface.addColumn('orders', 'pi', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Step 2: Update all existing rows to set 'pi' to an empty string
    await queryInterface.sequelize.query(
      'UPDATE orders SET pi = \'\' WHERE pi IS NULL'
    );

    // Step 3: Change the column to not allow null values
    await queryInterface.changeColumn('orders', 'pi', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'pi');
  }
};
