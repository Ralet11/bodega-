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
          <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-96 relative transition-transform transform-gpu scale-95 hover:scale-100 duration-300 ease-in-out">
            <h2 className="text-3xl font-extrabold mb-6 tracking-wide text-black border-b-4 border-yellow-500 pb-2">Add New Category</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-500 transition-shadow duration-300 ease-in-out"
                />
              </div>
              <button
                className="bg-yellow-500 text-black py-3 px-6 rounded-xl font-semibold shadow-md hover:bg-yellow-600 transition-colors duration-300 ease-in-out"
                type="submit"
              >
                Save
              </button>
            </form>
            <button
              onClick={handleClose}
              className="mt-6 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
            >
              Close
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