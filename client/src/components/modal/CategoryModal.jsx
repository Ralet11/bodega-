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

  const preHandleClose = () => {
    handleClose();
    newCategory.name = ''; // Clear the input field
  };

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fondo oscuro */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal */}
          <div className="bg-white w-full max-w-4xl mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
            <div className="bg-blue-400 p-2 rounded-t-lg">
              <h2 className="text-lg font-semibold text-white">Add New Category</h2>
            </div>
            <div className="p-2">
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-2">
                <div className="bg-gray-100 p-2 rounded-lg shadow-md">
                  <h3 className="text-md font-semibold mb-2">Category Details</h3>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded text-sm"
                      required
                    />
                  </div>
                  <button
                    className="bg-blue-400 text-white py-1 px-2 rounded hover:bg-blue-600 w-full mt-2 text-xs"
                    type="submit"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
              <button onClick={preHandleClose} className="text-blue-500 hover:underline cursor-pointer text-xs">
                Close
              </button>
            </div>
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
};
