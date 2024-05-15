import PropTypes from 'prop-types';

export default function CategoryModal({
  show,
  handleClose,
  handleSubmit,
  handleInputChange,
  newCategory,
}) {
  const onSubmit = (e) => {
    e.preventDefault(); // Evita la recarga de la página
    handleSubmit();
  };

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fondo oscuro */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal */}
          <div className="bg-white p-4 rounded shadow-md w-80 relative">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                type="submit"
              >
                Guardar
              </button>
            </form>
            <button
              onClick={handleClose}
              className="mt-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

CategoryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  newCategory: PropTypes.object.isRequired,
  local_id: PropTypes.number.isRequired,
};
