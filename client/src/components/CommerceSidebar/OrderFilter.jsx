import React from 'react';

const OrderFilter = (props) => {
  const { className, ...rest } = props; // Extraer className de las props
  return (
    <div className="mb-4 px-6 py-1 border-r border-gray-200 flex-grow">
      <h3 className=" text-lg font-semibold mb-4">Order by</h3>
      <div className="flex flex-col"> {/* Cambio a flex-direction: column */}
        <label className="flex items-center mb-2">
          <input type="radio" className="mr-2" name="order" value="newest" />
          <span>Newest</span>
        </label>
        <label className="flex items-center mb-2">
          <input type="radio" className="mr-2" name="order" value="oldest" />
          <span>Oldest</span>
        </label>
      </div>
    </div>
  );
};

export default OrderFilter;
