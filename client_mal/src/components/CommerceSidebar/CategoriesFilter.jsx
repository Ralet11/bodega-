import React from 'react';

const CategoriesFilter = (props) => {
  const { className, ...rest } = props; // Extraer className de las props
  return (
    <div className="mb-4 px-6 py-1 border-r border-gray-200 flex-grow">
      <h3 className="font-semibold mb-4 text-lg">Categories</h3>
      <div className="flex flex-col"> {/* Cambio a flex-direction: column */}
        <label className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" value="smokeShops" />
          <span>Smoke Shops</span>
        </label>
        <label className="flex items-center mb-2"> {/* Agregar estilo flex y align-items */}
          <input type="checkbox" className="mr-2" value="drinks" />
          <span>Drinks</span>
        </label>
        <label className="flex items-center mb-2"> {/* Agregar estilo flex y align-items */}
          <input type="checkbox" className="mr-2" value="drinks" />
          <span>Weed</span>
        </label>
        <label className="flex items-center mb-2"> {/* Agregar estilo flex y align-items */}
          <input type="checkbox" className="mr-2" value="drinks" />
          <span>Accesories</span>
        </label>
      </div>
    </div>
  );
};

export default CategoriesFilter;
