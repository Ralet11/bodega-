import React from 'react';
import { PlusCircle, Trash } from 'lucide-react';
import ProductCard from './ProductCard';

function ProductList({ products, searchTerm, onSearchTermChange, onProductClick, onAddProduct, onDeleteCategory }) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full md:w-[800px] min-h-[600px]">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-full text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full md:w-[300px]"
        />
        <span
          onClick={onAddProduct}
          className="text-black-500 hover:text-green-700 font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <p className="text-sm">Add Item</p>
        </span>
        <span
          onClick={onDeleteCategory}
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
            filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={product.id === selectedProduct?.id}
                handleClick={onProductClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
