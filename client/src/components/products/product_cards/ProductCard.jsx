import PropTypes from 'prop-types';
import React from 'react';

const ProductCard = ({ product, isSelected, handleClick }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 ${
        isSelected ? 'border-2 border-blue-500' : 'border border-gray-300'
      } cursor-pointer`}
      onClick={() => handleClick(product.id)}
    >
      <div className="mb-2">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md"
        />
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-1">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ProductCard;
