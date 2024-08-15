import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TrashIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const ExtrasModal = ({ show, handleClose, extras, handleSaveExtras }) => {
  const [editedExtras, setEditedExtras] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [deleteExtraTooltip, setDeleteExtraTooltip] = useState(null); // Tooltip for delete extra
  const [deleteOptionTooltip, setDeleteOptionTooltip] = useState(null); // Tooltip for delete option

  useEffect(() => {
    setEditedExtras(extras);
  }, [extras]);

  const handleExtraChange = (index, field, value) => {
    const updatedExtras = [...editedExtras];
    updatedExtras[index][field] = value;
    setEditedExtras(updatedExtras);
  };

  const handleOptionChange = (extraIndex, optionIndex, field, value) => {
    const updatedExtras = [...editedExtras];
    updatedExtras[extraIndex].options[optionIndex][field] = value;
    setEditedExtras(updatedExtras);
  };

  const addNewOption = (extraIndex) => {
    const updatedExtras = [...editedExtras];
    updatedExtras[extraIndex].options.push({ name: '', price: 0 });
    setEditedExtras(updatedExtras);
  };

  const addNewExtra = () => {
    setEditedExtras([...editedExtras, { name: '', options: [{ name: '', price: 0 }], required: false }]);
  };

  const removeOption = (extraIndex, optionIndex) => {
    const updatedExtras = [...editedExtras];
    updatedExtras[extraIndex].options.splice(optionIndex, 1);
    setEditedExtras(updatedExtras);
  };

  const removeExtra = (index) => {
    const updatedExtras = [...editedExtras];
    updatedExtras.splice(index, 1);
    setEditedExtras(updatedExtras);
  };

  const handleSave = () => {
    handleSaveExtras(editedExtras);
    handleClose();
  };

  const toggleRequired = (index) => {
    const updatedExtras = [...editedExtras];
    updatedExtras[index].required = !updatedExtras[index].required;
    setEditedExtras(updatedExtras);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white w-full max-w-md mx-4 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
        <div className="bg-blue-400 p-2 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-semibold text-white">Edit Extras</h2>
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <InformationCircleIcon className="h-5 w-5 text-white cursor-pointer" />
              {showTooltip && (
                <div className="absolute left-full top-0 ml-2 bg-gray-200 text-gray-700 text-xs p-2 rounded shadow-lg w-64 z-10">
                  To edit extras:
                  <ul className="list-disc pl-4">
                    <li>Enter the extra name.</li>
                    <li>Check the box if this extra is required for the customer.</li>
                    <li>Add options for the extra, with their name and additional price.</li>
                    <li>You can add as many options as you need.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-2 overflow-y-auto max-h-[60vh]">
          {editedExtras?.map((extra, index) => (
            <div key={index} className="mb-2 border p-2 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-semibold">
                  <label className="block text-gray-700 text-xs">Extra Name</label>
                  <input
                    type="text"
                    value={extra.name}
                    onChange={(e) => handleExtraChange(index, 'name', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                  />
                </h3>
                <button
                  onMouseEnter={() => setDeleteExtraTooltip(index)}
                  onMouseLeave={() => setDeleteExtraTooltip(null)}
                  onClick={() => removeExtra(index)}
                  className="text-red-500 hover:text-red-700 relative"
                >
                  <TrashIcon className="w-4 h-4" />
                  {deleteExtraTooltip === index && (
                    <div className="absolute top-full mt-1 bg-gray-200 text-gray-700 text-xs p-1 rounded shadow-lg z-10">
                      Delete Extra
                    </div>
                  )}
                </button>
              </div>
              <div className="flex items-center mb-1">
                <label className="block text-gray-700 text-xs">Required</label>
                <input
                  type="checkbox"
                  checked={extra.required}
                  onChange={() => toggleRequired(index)}
                  className="ml-2"
                />
              </div>
              <ul className="list-disc list-inside">
                {extra.options.map((option, optionIndex) => (
                  <li key={optionIndex} className="flex items-center mb-1 space-x-2 relative">
                    <label className="block text-gray-700 text-xs w-full">
                      Option {optionIndex + 1}
                      <input
                        type="text"
                        placeholder="Option Name"
                        value={option.name}
                        onChange={(e) => handleOptionChange(index, optionIndex, 'name', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                      />
                    </label>
                    <label className="block text-gray-700 text-xs">
                      Added price ($)
                      <input
                        type="number"
                        placeholder="Price"
                        value={option.price}
                        onChange={(e) => handleOptionChange(index, optionIndex, 'price', e.target.value)}
                        className="w-20 p-1 border border-gray-300 rounded text-xs no-spin"
                        step="0.01"
                        min="0"
                      />
                    </label>
                    <button
                      type="button"
                      onMouseEnter={() => setDeleteOptionTooltip(optionIndex)}
                      onMouseLeave={() => setDeleteOptionTooltip(null)}
                      onClick={() => removeOption(index, optionIndex)}
                      className="ml-2 text-red-500 hover:text-red-700 relative"
                    >
                      <TrashIcon className="h-4 w-4" />
                      {deleteOptionTooltip === optionIndex && (
                        <div className="absolute top-full mt-1 bg-gray-200 text-gray-700 text-xs p-1 rounded shadow-lg z-10">
                          Delete Option
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => addNewOption(index)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mt-1 text-xs"
              >
                Add Option
              </button>
            </div>
          ))}
          <button
            onClick={addNewExtra}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mt-2 text-xs"
          >
            Add Extra
          </button>
        </div>
        <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
          <button
            onClick={handleClose}
            className="text-blue-500 hover:underline cursor-pointer mr-2 text-xs"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

ExtrasModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  extras: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          price: PropTypes.number
        })
      )
    })
  ).isRequired,
  handleSaveExtras: PropTypes.func.isRequired,
};

export default ExtrasModal;