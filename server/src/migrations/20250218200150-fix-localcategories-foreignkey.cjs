module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Eliminar la clave foránea si ya existe
    await queryInterface.removeConstraint('local', 'local_locals_categories_id_fkey')
      .catch(() => console.log('No existing foreign key found, skipping removal.'));

    // 2. Asegurar que la columna tenga el tipo correcto
    await queryInterface.changeColumn('local', 'locals_categories_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 3. Agregar la nueva clave foránea correctamente
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
    // Revertir cambios
    await queryInterface.removeConstraint('local', 'local_locals_categories_id_fkey');
    await queryInterface.changeColumn('local', 'locals_categories_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
