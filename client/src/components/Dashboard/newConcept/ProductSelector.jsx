import React from 'react';

const ProductSelector = ({ products, onSelectProduct }) => {
  return (
    <div className="my-4">
      <h2 className="text-center text-2xl font-bold">These are your Products</h2>
      <div className="flex justify-center flex-wrap mt-4">
        {products.map(product => (
          <button
            key={product.id}
            className="m-2 p-2 bg-gray-300 rounded"
            onClick={() => onSelectProduct(product.id)}
          >
            {product.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSelector;
