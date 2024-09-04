import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProductCard from './ProductCard';
import UploadExcelModal from '../../modal/UploadExcelModal';
import { getParamsEnv } from '../../../functions/getParamsEnv';
import { PlusCircle, Upload } from 'lucide-react';

const { API_URL_BASE } = getParamsEnv();

function ProductCards({
  selectedCategory,
  products,
  setProducts,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  handleCardClick,
  selectedProduct,
  setShowNewProductModal,
}) {
  const token = useSelector((state) => state?.client.token);
  const [showUploadExcelModal, setShowUploadExcelModal] = useState(false);

  const handleOpenNewProductModal = () => {
    setShowNewProductModal(true);
  };

  const handleOpenUploadExcelModal = () => {
    setShowUploadExcelModal(true);
  };

  const handleDeleteCategory = async () => {
    console.log('hola');
    try {
      await axios.delete(`${API_URL_BASE}/api/categories/hide/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([]);
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 placeholder-gray-400 text-gray-700 bg-white rounded-full text-xs border-0 shadow outline-none focus:outline-none focus:ring w-full md:w-[200px]"
        />
        <div className="flex space-x-2">
          <button
            className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-500 font-semibold border border-blue-500 rounded-md bg-transparent hover:bg-blue-500 hover:text-white transition-colors duration-200"
            onClick={handleOpenNewProductModal}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Item</span>
          </button>

          <button
            className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-500 font-semibold border border-blue-500 rounded-md bg-transparent hover:bg-blue-500 hover:text-white transition-colors duration-200"
            onClick={handleOpenUploadExcelModal}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Excel</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-xs">No hay productos disponibles</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={product.id === selectedProduct?.id}
              handleClick={handleCardClick}
            />
          ))
        )}
      </div>
      {showUploadExcelModal && (
        <UploadExcelModal
          show={showUploadExcelModal}
          handleClose={() => setShowUploadExcelModal(false)}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
}

ProductCards.propTypes = {
  products: PropTypes.array.isRequired,
  setProducts: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object,
  selectedCategory: PropTypes.number,
  setShowNewProductModal: PropTypes.func.isRequired,
};

export default ProductCards;