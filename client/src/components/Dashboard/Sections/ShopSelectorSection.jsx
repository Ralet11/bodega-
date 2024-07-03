import React from 'react';
import ShopSelector from '../newConcept/ShopSelector';
import './ShopSelectorSection.css';

const ShopSelectorSection = ({ shops, onSelectShop }) => {
  return (
    <div className="shop-selector-section">
      <h2 className="section-title">Select Your Shop</h2>
      <ShopSelector shops={shops} onSelectShop={onSelectShop} />
    </div>
  );
};

export default ShopSelectorSection;
