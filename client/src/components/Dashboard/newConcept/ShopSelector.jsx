import React, { useState } from 'react';
import './ShopSelector.css';

const ShopSelector = ({ shops, onSelectShop }) => {
  const [isHovered, setIsHovered] = useState(null);

  const handleMouseEnter = (id) => {
    setIsHovered(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    <div className="shop-selector-container">
      
      <div className="shop-selector-button-container">
        <button
          className={`shop-selector-button ${isHovered === 'all' ? 'shop-selector-button-hover' : ''}`}
          onMouseEnter={() => handleMouseEnter('all')}
          onMouseLeave={handleMouseLeave}
          onClick={() => onSelectShop('all')}
        >
          All
        </button>
        {shops.map((shop) => (
          <button
            key={shop.id}
            className={`shop-selector-button ${isHovered === shop.id ? 'shop-selector-button-hover' : ''}`}
            onMouseEnter={() => handleMouseEnter(shop.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onSelectShop(shop.id)}
          >
            {shop.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopSelector;
