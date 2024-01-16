// ProductCards.js
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { PlusCircle, Trash } from 'lucide-react';

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
    

    const handleClick = (product) => {
        handleCardClick(product);
    };


    const handleOpenNewProducModal =() => {
        setShowNewProductModal(true)
    }

    

    const handleDeleteCategory = () => {
        // Mostrar una ventana de confirmación antes de borrar la categoría
        const confirmDeleteCategory = window.confirm(
            '¿Estás seguro que quieres borrar la categoría?'
        );

        if (confirmDeleteCategory) {
            axios
                .delete(`http://localhost:3000/api/categories/hide/${category_id}`)
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


    console.log("productos")
    console.log(products)
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <div className="">
            <div className="flex gap-[20px] mb-4 max-h-[40px]">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-full text-sm border-0 shadow outline-none focus:outline-none focus:ring w-[300px] h-[-10px]"
                />

                <span
                    onClick={handleOpenNewProducModal}
                    className="text-black-500 hover:text-green-700 font-bold py-2 px-4 rounded-full cursor-pointer"
                >
                    <PlusCircle className="w-3 h-3 mr-2" />
                    <p className="text-xs">Add Item</p>
                </span>
                <span
                    onClick={handleDeleteCategory}
                    className="text-black-500 hover:text-red-700 font-bold py-2 px-4 rounded-full cursor-pointer"
                >
                    <Trash className="w-3 h-3" />
                    <p className="text-xs">Delete Category</p>
                </span>
            </div>
            <div className="min-h-[500px] max-h-[500px]">
                <div className="min-h-[500px] flex flex-wrap gap-2 w-[750px] max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">
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
        </>
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
    selectedCategory: PropTypes.object
};

export default ProductCards;
