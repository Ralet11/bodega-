'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('discounts', 'fixedValue', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('discounts', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id'
      }
    });

    await queryInterface.addColumn('discounts', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    });

    await queryInterface.addColumn('discounts', 'usageLimit', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
    });

    await queryInterface.addColumn('discounts', 'timesUsed', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('discounts', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    await queryInterface.addColumn('discounts', 'description', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('discounts', 'discountType', {
      type: Sequelize.ENUM('percentage', 'fixed'),
      allowNull: false,
      defaultValue: 'percentage'
    });

    await queryInterface.addColumn('discounts', 'minPurchaseAmount', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('discounts', 'maxDiscountAmount', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('discounts', 'conditions', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Remove columns that are no longer needed
    await queryInterface.removeColumn('discounts', 'initialPrice');
    await queryInterface.removeColumn('discounts', 'discountPrice');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the removed columns back in case of rollback
    await queryInterface.addColumn('discounts', 'initialPrice', {
      type: Sequelize.FLOAT,
      allowNull: false
    });

    await queryInterface.addColumn('discounts', 'discountPrice', {
      type: Sequelize.FLOAT,
      allowNull: false
    });

    // Remove the newly added columns in case of rollback
    await queryInterface.removeColumn('discounts', 'fixedValue');
    await queryInterface.removeColumn('discounts', 'product_id');
    await queryInterface.removeColumn('discounts', 'category_id');
    await queryInterface.removeColumn('discounts', 'usageLimit');
    await queryInterface.removeColumn('discounts', 'timesUsed');
    await queryInterface.removeColumn('discounts', 'active');
    await queryInterface.removeColumn('discounts', 'description');
    await queryInterface.removeColumn('discounts', 'discountType');
    await queryInterface.removeColumn('discounts', 'minPurchaseAmount');
    await queryInterface.removeColumn('discounts', 'maxDiscountAmount');
    await queryInterface.removeColumn('discounts', 'conditions');
  }
};
