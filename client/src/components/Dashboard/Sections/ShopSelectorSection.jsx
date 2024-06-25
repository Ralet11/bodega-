import React from 'react';
import ShopSelector from '../newConcept/ShopSelector';

const ShopSelectorSection = ({ shops, onSelectShop }) => {
  return (
    <div className="shop-selector-section">
      <h2 className="text-2xl font-bold mb-4">Select Your Shop</h2>
      <ShopSelector shops={shops} onSelectShop={onSelectShop} />
    </div>
  );
};

export default ShopSelectorSection;
