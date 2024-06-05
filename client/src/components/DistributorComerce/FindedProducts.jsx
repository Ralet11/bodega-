import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setDistProd, setSelectedSubCategory, setFindedProducts } from '../../redux/actions/actions';
import axios from 'axios';
import { getParamsEnv } from '../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const FindedProducts = () => {
  const [filters, setFilters] = useState({ sortOrder: '', subcategory: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const findedProducts = useSelector((state) => state?.findedProducts);
  const subcategories = useSelector((state) => state?.subcategories);
  const selectedSubcategory = useSelector((state) => state?.selectedSubcategory);
  const allProducts = useSelector((state) => state?.allDistProducts);
  const [brands, setBrands] = useState(null);
  const token = useSelector((state) => state?.client.token);

  useEffect(() => {
    if (selectedSubcategory) {
      setFilters((prevFilters) => ({ ...prevFilters, subcategory: selectedSubcategory.toString() }));
    }
  }, [selectedSubcategory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/brands/getAllByCategory/${selectedSubcategory}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.statusText === "OK") {
          setBrands(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedSubcategory) {
      fetchBrands();
    }
  }, [selectedSubcategory, token]);

  const handleSelectSubCategory = (id) => {
    const filtered = allProducts.filter(product => product.subcategory_id === id);
    dispatch(setSelectedSubCategory(id));
    dispatch(setFindedProducts(filtered));
    navigate("/searchProducts");
  };

  const handleSelectBrand = (id) => {
    const filtered = allProducts.filter(product => product.brand_id === id);
    dispatch(setFindedProducts(filtered));
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
    if (filters.subcategory) {
      products = products.filter((product) => product.subcategory_id === parseInt(filters.subcategory));
    }
    return products;
  };

  return (
    <div className="flex flex-col md:mt-[8rem] md:min-h-screen md:w-[80%] h-[100%] bg-gray-200 m-auto md:flex-row w-full p-2 space-y-2 md:space-y-0 md:space-x-2">
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
          <label className="text-sm font-medium text-gray-700">Subcategory</label>
          <select
            name="subcategory"
            value={filters.subcategory}
            onChange={handleFilterChange}
            onClick={() => handleSelectSubCategory(parseInt(filters.subcategory))}
            className="w-full mt-1 p-1 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            {subcategories.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>
        {brands && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Brands</h3>
            <ul className="mt-2">
              {brands.map((brand) => (
                <li
                  key={brand.id}
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleSelectBrand(brand.id)}
                >
                  {brand.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="flex flex-col w-full max-h-[700px] overflow-auto bg-white md:p-10 md:w-3/4">
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
                    <span className="line-through">${(product.price * 1.1).toFixed(2)}</span> 10% OFF
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