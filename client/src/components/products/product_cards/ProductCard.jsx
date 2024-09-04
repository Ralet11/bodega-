import PropTypes from 'prop-types';
import React from 'react';
import { ShoppingBag, Gift } from 'lucide-react'; // Icons for extras and discounts

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

        {/* Show icons for extras and discounts */}
        <div className="flex justify-center space-x-2 mt-2">
          {product.extras && product.extras.length > 0 && (
            <div className="flex items-center">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
              <span className="ml-1 text-xs text-gray-500">Extras</span>
            </div>
          )}
          {product.discounts && product.discounts.length > 0 && (
            <div className="flex items-center">
              <Gift className="w-4 h-4 text-red-500" />
              <span className="ml-1 text-xs text-gray-500">Discounts</span>
            </div>
          )}
        </div>
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
    extras: PropTypes.array, // Added for extras
    discounts: PropTypes.array, // Added for discounts
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ProductCard;