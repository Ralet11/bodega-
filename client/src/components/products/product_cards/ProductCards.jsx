import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { PlusCircle, Trash } from 'lucide-react';
import { getParamsEnv } from '../../../functions/getParamsEnv';
import { useSelector } from 'react-redux';

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

  const handleClick = (product) => {
    handleCardClick(product);
  };

  const handleOpenNewProducModal = () => {
    setShowNewProductModal(true);
  };

  const handleDeleteCategory = () => {
    // Mostrar una ventana de confirmación antes de borrar la categoría
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
          // Actualiza las categorías en el estado después de eliminar
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== category_id)
          );

          // Verifica si la categoría eliminada es la categoría seleccionada,
          // y si lo es, establece selectedCategory en null
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
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-full text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full md:w-[300px]"
        />

        <span
          onClick={handleOpenNewProducModal}
          className="text-black-500 hover:text-green-700 font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <p className="text-sm">Add Item</p>
        </span>
        <span
          onClick={handleDeleteCategory}
          className="text-black-500 hover:text-red-700 font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
        >
          <Trash className="w-5 h-5 mr-2" />
          <p className="text-sm">Delete Category</p>
        </span>
      </div>
      <div className="min-h-[500px] max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {filteredProducts.length === 0 ? (
            <p>No hay productos disponibles</p>
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
};

export default ProductCards;