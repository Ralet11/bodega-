import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { useSelector } from 'react-redux';

const { API_URL_BASE } = getParamsEnv();

const PromotionModal = ({ show, handleClose, handleCreatePromotion, product, activeShop }) => {
  const [promotionTypeId, setPromotionTypeId] = useState('');
  const [promotionTypes, setPromotionTypes] = useState([]);
  const [promotionData, setPromotionData] = useState({});
  const client = useSelector((state) => state?.client.client);

  // Get the token from the Redux store
  const token = useSelector((state) => state?.client.token);

  // Define the mapping from promotion type IDs to their fields
  const promotionTypeFields = {
    1: [ // Assuming 'BuyToWin' has an id of 1
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        min: 1,
      },
    ],
    // Add other promotion types and their fields here
  };

  const handlePromotionTypeChange = (e) => {
    const selectedId = e.target.value;
    setPromotionTypeId(selectedId);
    setPromotionData({}); // Reset promotionData when promotionType changes
  };

  const handleFieldChange = (fieldName, value) => {
    setPromotionData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    const fetchPromotionTypes = async () => {
      try {
        const response = await axios.get(
          `${API_URL_BASE}/api/promotions/getPromotionTypes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPromotionTypes(response.data);
      } catch (error) {
        console.error('Error fetching promotion types:', error);
      }
    };
    fetchPromotionTypes();
  }, [token]);

  const handleSave = () => {
    const data = {
      clientId: client.id,
      productId: product.id,
      promotionTypeId: promotionTypeId,
      localId: activeShop,
      ...promotionData,
    };
    handleCreatePromotion(data);
    handleClose();
  };

  if (!show) {
    return null;
  }

  // Get the fields for the selected promotion type from the mapping
  const promotionFields = promotionTypeFields[promotionTypeId] || [];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <div className="bg-white w-full max-w-md mx-4 md:mx-auto rounded-lg shadow-lg relative">
        <div className="bg-purple-500 p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-white">Create Promotion</h2>
        </div>
        <div className="p-4 space-y-4">
          {/* Display product name */}
          {product && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
            </div>
          )}
          {/* Promotion Type Selection */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Promotion Type
            </label>
            <select
              value={promotionTypeId}
              onChange={handlePromotionTypeChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Promotion Type</option>
              {promotionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          {/* Dynamic Fields Based on Promotion Type */}
          {promotionFields.map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 text-sm mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={promotionData[field.name] || ''}
                onChange={(e) =>
                  handleFieldChange(field.name, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
                min={field.min || ''}
              />
            </div>
          ))}
        </div>
        <div className="bg-gray-100 px-4 py-3 flex justify-end rounded-b-lg">
          <button
            onClick={handleClose}
            className="text-purple-500 hover:underline cursor-pointer mr-4"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

PromotionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleCreatePromotion: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

export default PromotionModal;
