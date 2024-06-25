import React from 'react';
import ProductSelector from '../newConcept/ProductSelector';

const ProductSelectorSection = ({ products, onSelectProduct }) => {
  return (
    <div className="product-selector-section">
      <h2 className="text-2xl font-bold mb-4">Select Your Product</h2>
      <ProductSelector products={products} onSelectProduct={onSelectProduct} />
    </div>
  );
};

export default ProductSelectorSection;
