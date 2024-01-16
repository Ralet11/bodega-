// ProductCard.js
import PropTypes from 'prop-types';
import { useState } from 'react';

const ProductCard = ({ product, isSelected, handleClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    handleClick(product);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-2 w-[150px] h-[200px] relative ${
        isSelected ? 'border border-blue-500' : ''
      } mt-2 mb-2 ml-4 mr-1 flex flex-col justify-center items-center`} // Aplicar flex y clases de alineación
    >
      <div className="mb-2" onClick={toggleDetails}>
        <img
          src={`http://localhost:3000/${product.img}`}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-full"
        />
      </div>
      <h2 className="text-lg font-semibold text-center">{product.name}</h2> {/* Alineación centrada */}
      <p className="text-sm text-gray-600">${product.price}</p>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ProductCard;
