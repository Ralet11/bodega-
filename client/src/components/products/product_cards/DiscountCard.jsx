import PropTypes from 'prop-types';
import React from 'react';

const DiscountCard = ({ discount, isSelected, handleClick }) => {

  // Map delivery values to text
  const getOrderType = (delivery) => {
    switch (delivery) {
      case 0:
        return 'Order-in';
      case 1:
        return 'Pick-up';
      case 2:
        return 'Delivery';
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-2xl ${
        isSelected ? 'border-2 border-green-500' : 'border border-gray-300'
      } cursor-pointer hover:bg-gray-50`}
      onClick={() => handleClick(discount.id)}
    >
      <div className="mb-3 rounded-lg overflow-hidden relative">
        <img
          src={discount.img}
          alt={discount.productName}
          className="w-full h-36 object-cover transition-opacity hover:opacity-90"
        />
        <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
          {discount.percentage}% OFF
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{discount.productName}</h2>
        <p className="text-sm text-gray-500 mb-2">Discount: {discount.percentage}%</p>
        <p className="text-sm text-gray-500 mb-2">Applies to: {discount.productName}</p>

        {/* Display the order type with improved badge-like style */}
        <div className="inline-block px-3 py-1 mt-3 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
          {getOrderType(discount.delivery)}
        </div>
      </div>
    </div>
  );
};

DiscountCard.propTypes = {
  discount: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    delivery: PropTypes.number.isRequired, // Added delivery prop
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default DiscountCard;