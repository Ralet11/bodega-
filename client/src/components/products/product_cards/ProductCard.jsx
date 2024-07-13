import PropTypes from 'prop-types';
import { useState } from 'react';

const ProductCard = ({ product, isSelected, handleClick, showDetails }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-1 w-full sm:w-[140px] h-auto sm:h-[180px] relative transition-transform transform hover:scale-105 ${
        isSelected ? 'border-2 border-blue-500' : 'border border-gray-300'
      } flex flex-col justify-between items-center mt-1 mb-1 cursor-pointer`}
      onClick={() => handleClick(product.id)}
    >
      <div className="mb-1">
        <img
          src={product.img}
          alt={product.name}
          className="w-14 h-14 object-cover rounded-full shadow-sm"
        />
      </div>
      <div className="mb-1 text-center">
        <h2 className="text-xs pb-8  font-semibold text-gray-800">{product.name}</h2>
        <p className="text-xs text-gray-600">${product.price.toFixed(2)}</p>
      </div>
      {showDetails && isSelected && (
        <div className="absolute bottom-1 left-1 right-1 bg-gray-100 p-1 rounded-lg shadow-inner text-xs text-gray-700">
          {product.description}
        </div>
      )}
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
  showDetails: PropTypes.bool.isRequired,
};

export default ProductCard;
