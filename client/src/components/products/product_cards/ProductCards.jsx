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

  console.log(products, 'products');

  const handleOpenNewProductModal = () => {
    setShowNewProductModal(true);
  };

  const handleOpenUploadExcelModal = () => {
    setShowUploadExcelModal(true);
  };

  const handleDeleteCategory = async () => {

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
       
        <div className="flex space-x-2">


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