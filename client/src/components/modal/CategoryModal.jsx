import PropTypes from 'prop-types';

// Updated colors
const colors = {
  primary: '#FFB74D', // Warm orange
  textPrimary: '#000000', // Black
  textSecondary: '#FFFFFF', // White
  highlight: '#FFA726', // Softer orange
  border: '#BDBDBD', // Neutral gray
};

export default function CategoryModal({
  show,
  handleClose,
  handleSubmit,
  handleInputChange,
  newCategory,
}) {
  const onSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    handleSubmit();
  };

  const preHandleClose = () => {
    handleClose();
    newCategory.name = ''; // Clear the input field
  };

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          {/* Dark background */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal */}
          <div
            className="bg-white w-full max-w-4xl mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto"
            style={{ borderColor: colors.border }}
          >
            <div
              className="p-4 rounded-t-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Add New Category
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
                <div
                  className="p-4 rounded-lg shadow-md"
                  style={{ backgroundColor: '#F5F5F5' }}
                >
                  <h3
                    className="text-md font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Category Details
                  </h3>
                  <div className="mb-4">
                    <label
                      className="block text-sm mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded text-sm focus:outline-none"
                      style={{
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                      required
                    />
                  </div>
                  <button
                    className="py-2 px-4 rounded w-full text-sm font-medium hover:opacity-80 focus:outline-none"
                    type="submit"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.textSecondary,
                    }}
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
            <div
              className="px-4 py-3 flex justify-end rounded-b-lg"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <button
                onClick={preHandleClose}
                className="text-sm font-medium hover:underline focus:outline-none"
                style={{ color: colors.primary }}
              >
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
