import PropTypes from 'prop-types';
import React from 'react';
import { ShoppingBag, Gift, Star } from 'lucide-react'; // Added Star icon for promotions

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

        {/* Show icons for extras, discounts, and promotions */}
        <div className="flex justify-center space-x-2 mt-2">
          {product.extras && product.extras.length > 0 && (
            <div className="flex items-center group relative">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded py-1 px-2">
                Extras
              </div>
            </div>
          )}
          {product.discounts && product.discounts.length > 0 && (
            <div className="flex items-center group relative">
              <Gift className="w-4 h-4 text-green-500" />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded py-1 px-2">
                Discounts
              </div>
            </div>
          )}
          {product.promotions && product.promotions.length > 0 && (
            <div className="flex items-center group relative">
              <Star className="w-4 h-4 text-purple-500" />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded py-1 px-2">
                Promotions
              </div>
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
    categories_id: PropTypes.number.isRequired,
    clientId: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    discounts: PropTypes.array,
    extras: PropTypes.array,
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    promotions: PropTypes.array, // Added for promotions
    state: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ProductCard;
