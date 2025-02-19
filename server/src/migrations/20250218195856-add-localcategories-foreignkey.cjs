module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Asegurarnos de que la columna existe
    await queryInterface.changeColumn('local', 'locals_categories_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // O false si es obligatorio
    });

    // Agregar la clave foránea correctamente
    await queryInterface.addConstraint('local', {
      fields: ['locals_categories_id'],
      type: 'foreign key',
      name: 'local_locals_categories_id_fkey',
      references: {
        table: 'locals_categories',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir los cambios
    await queryInterface.removeConstraint('local', 'local_locals_categories_id_fkey');
    await queryInterface.changeColumn('local', 'locals_categories_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Ajustar según necesidad
    });
  }
};
