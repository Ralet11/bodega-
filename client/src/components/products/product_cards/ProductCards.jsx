import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { PlusCircle, Trash, Upload } from 'lucide-react';
import { getParamsEnv } from '../../../functions/getParamsEnv';
import { useSelector } from 'react-redux';
import UploadExcelModal from '../../modal/UploadExcelModal';

const { API_URL_BASE } = getParamsEnv();

function ProductCards({
  selectedCategory,
  setSelectedCategory,
  setCategories,
  products,
  category_id,
  searchTerm,
  setSearchTerm,
  handleCardClick,
  selectedProduct,
  setShowNewProductModal,
}) {
  const token = useSelector((state) => state?.client.token);
  const [showUploadExcelModal, setShowUploadExcelModal] = useState(false);

  const handleClick = (product) => {
    handleCardClick(product);
  };

  const handleOpenNewProducModal = () => {
    setShowNewProductModal(true);
  };

  const handleOpenUploadExcelModal = () => {
    setShowUploadExcelModal(true);
  };

  const handleDeleteCategory = () => {
    const confirmDeleteCategory = window.confirm(
      '¿Estás seguro que quieres borrar la categoría?'
    );

    if (confirmDeleteCategory) {
      axios
        .delete(`${API_URL_BASE}/api/categories/hide/${category_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Categoría eliminada:', response.data);
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== category_id)
          );

          if (selectedCategory === category_id) {
            setSelectedCategory(null);
          }
        })
        .catch((error) => {
          console.error('Error al eliminar la categoría:', error);
        });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 placeholder-gray-400 text-gray-700 relative bg-white rounded-full text-xs border-0 shadow outline-none focus:outline-none focus:ring w-full md:w-[200px]"
        />

        <span
          onClick={handleOpenNewProducModal}
          className="text-black-500 hover:text-green-700 font-bold py-1 px-2 rounded-full cursor-pointer flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          <p className="text-xs">Add Item</p>
        </span>
        <span
          onClick={handleDeleteCategory}
          className="text-black-500 hover:text-red-700 font-bold py-1 px-2 rounded-full cursor-pointer flex items-center"
        >
          <Trash className="w-4 h-4 mr-1" />
          <p className="text-xs">Delete Category</p>
        </span>
        <span
          onClick={handleOpenUploadExcelModal}
          className="text-black-500 hover:text-blue-700 font-bold py-1 px-2 rounded-full cursor-pointer flex items-center"
        >
          <Upload className="w-4 h-4 mr-1" />
          <p className="text-xs">Upload Excel</p>
        </span>
      </div>
      <div className="min-h-[300px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">
        <div className="flex flex-wrap gap-1 justify-center md:justify-start">
          {filteredProducts.length === 0 ? (
            <p className="text-xs">No hay productos disponibles</p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={product.id === selectedProduct?.id}
                handleClick={handleClick}
              />
            ))
          )}
        </div>
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
  category_id: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object,
  setCategories: PropTypes.func.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.number,
  setShowNewProductModal: PropTypes.func.isRequired,
};

export default ProductCards;