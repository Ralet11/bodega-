import React from 'react';

const ShopSelector = ({ shops, onSelectShop }) => {
  return (
    <div className="my-4">
      <h2 className="text-center text-2xl font-bold">Welcome to your Shops</h2>
      <div className="flex justify-center flex-wrap mt-4">
        <button className="m-2 p-2 bg-gray-300 rounded" onClick={() => onSelectShop('all')}>All</button>
        {shops.map(shop => (
          <button
            key={shop.id}
            className="m-2 p-2 bg-gray-300 rounded"
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
