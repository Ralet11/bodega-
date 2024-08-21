import PropTypes from 'prop-types';
import React from 'react';

const DiscountCard = ({ discount, isSelected, handleClick }) => {

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 ${
        isSelected ? 'border-2 border-green-500' : 'border border-gray-300'
      } cursor-pointer`}
      onClick={() => handleClick(discount.id)}
    >
      <div className="mb-2">
        <img
          src={discount.img}
          alt={discount.productName}
          className="w-full h-32 object-cover rounded-md"
        />
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">{discount.productName}</h2>
        <p className="text-sm text-gray-600 mb-1">Discount: {discount.percentage}%</p>
        <p className="text-sm text-gray-600 mb-1">Applies to: {discount.productName}</p>
      </div>
    </div>
  );
};

DiscountCard.propTypes = {
  discount: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default DiscountCard;