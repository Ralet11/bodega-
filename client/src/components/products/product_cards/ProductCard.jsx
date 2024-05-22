// ProductCard.js
import PropTypes from 'prop-types';
import { useState } from 'react';
import { getParamsEnv } from '../../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const ProductCard = ({ product, isSelected, handleClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    handleClick(product);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-2 w-full sm:w-[120px] h-auto sm:h-[150px] relative ${
        isSelected ? 'border border-blue-500' : ''
      } flex flex-col justify-center items-center mt-2 mb-2 cursor-pointer`}
      onClick={toggleDetails}
    >
      <div className="mb-2">
        <img
          src={`${API_URL_BASE}/${product.img}`}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-full"
        />
      </div>
      <h2 className="text-sm font-semibold text-center">{product.name}</h2>
      <p className="text-xs text-gray-600">${product.price}</p>
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
