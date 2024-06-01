import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setDistProd } from '../../redux/actions/actions';

const FindedProducts = () => {
  const [filters, setFilters] = useState({ sortOrder: '', category: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const findedProducts = useSelector((state) => state?.findedProducts);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const goToDetail = (distProduct) => {
    dispatch(setDistProd(distProduct));
    navigate('/distProduct-detail');
  };

  const handleHover = (index) => setHoveredIndex(index);

  const sortedProducts = () => {
    let products = [...findedProducts];
    if (filters.sortOrder === 'lessExpensive') {
      products.sort((a, b) => a.price - b.price);
    } else if (filters.sortOrder === 'moreExpensive') {
      products.sort((a, b) => b.price - a.price);
    }
    if (filters.category) {
      products = products.filter((product) => product.category === filters.category);
    }
    return products;
  };

  return (
    <div className="flex flex-col md:mt-[8rem] md:min-h-screen md:w-[80%] md:h- bg-gray-200 m-auto md:flex-row w-full p-2 space-y-2 md:space-y-0 md:space-x-2">
      {/* Filters Section */}
      <div className="flex flex-col md:p-10 w-full md:w-1/4 p-2 rounded-lg shadow-md">
        <h2 className="text-md font-semibold text-gray-800 mb-2">Filters</h2>
        <div className="mb-2">
          <label className="text-sm font-medium text-gray-700">Order By</label>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="w-full mt-1 p-1 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="lessExpensive">Less Expensive</option>
            <option value="moreExpensive">More Expensive</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full mt-1 p-1 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            {/* Agrega más categorías según sea necesario */}
          </select>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex flex-col w-full bg-white md:p-10  md:w-3/4">
        <h2 className="text-md font-semibold text-gray-800 mb-2">Find your products</h2>
        <div className="flex flex-col space-y-2">
          {sortedProducts().length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <h1 className="text-md font-bold text-gray-700">Products not found</h1>
            </div>
          ) : (
            sortedProducts().map((product, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row w-full p-2 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 ${hoveredIndex === index ? 'shadow-lg' : ''}`}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => handleHover(-1)}
                onClick={() => goToDetail(product)}
              >
                <div className="relative w-full md:w-1/4 overflow-hidden rounded-lg">
                  <img
                    className="w-full h-32 object-cover transition-transform duration-500 transform hover:scale-110"
                    src={hoveredIndex === index ? product.image2 : product.image1}
                    alt={product.name}
                  />
                </div>
                <div className="p-2 flex flex-col w-full md:w-3/4">
                  <h3 className="font-semibold text-md text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-700 text-md font-bold mb-1">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-red-500 mb-1">
                    <span className="line-through">${(product.price + 50).toFixed(2)}</span> 10% OFF
                  </p>
                  <p className="text-xs text-gray-500 mb-1">{product.description}</p>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Tienda del Producto</p>
                    {product.freeShipping && (
                      <p className="text-green-500 text-xs ml-0 md:ml-2">Envío gratis</p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <button className="py-1 px-2 bg-blue-500 text-white text-xs rounded-lg shadow hover:bg-blue-600 transition duration-300 mb-1 md:mb-0">
                      Add to Cart
                    </button>
                    <p className="text-xs text-gray-500 mb-1 md:mb-0">
                      Availability: <span className="text-green-500">In Stock</span>
                    </p>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500 flex items-center">
                      {Array.from({ length: product.rating }, (_, i) => (
                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FindedProducts;