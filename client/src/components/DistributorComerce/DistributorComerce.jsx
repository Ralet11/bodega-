import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDistProd } from '../../redux/actions/actions';
import CommerceSidebar from '../CommerceSidebar/CommerceSidebar';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { RocketLaunchIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import OrderFilter from '../CommerceSidebar/OrderFilter';
import PriceFilter from '../CommerceSidebar/PriceFilter';
import CategoriesFilter from '../CommerceSidebar/CategoriesFilter';

const { API_URL_BASE } = getParamsEnv();

const DistributorComerce = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const token = useSelector((state) => state?.client.token);
  const [filters, setFilters] = useState({
    order: 'newest',
    price: 50,
    categories: [],
    searchTerm: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(true); // Estado para controlar la visibilidad de los filtros

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/distProducts/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    let products = [...allProducts];

    if (filters.searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.categories.length > 0) {
      products = products.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    products = products.filter(product => product.price <= filters.price);

    if (filters.order === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredProducts(products);
  }, [filters, allProducts]);

  const handleHover = (index) => setHoveredIndex(index);

  const goToDetail = (distProduct) => {
    dispatch(setDistProd(distProduct));
    navigate('/distProduct-detail');
  };

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-100 pb-20">
      <div className="w-full max-w-screen-xl px-4">
        <CommerceSidebar setFilters={setFilters} filters={filters} />
      </div>
      <div className="flex flex-col px-2 md:flex-row justify-center w-full mt-8">
        <button 
          className="md:hidden flex items-center bg-[#F2BB26] text-black font-bold py-2 px-3 rounded-lg transition duration-300 hover:bg-[#F2BB26] focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 mb-4"
          onClick={toggleFiltersVisibility}
        >
          {filtersVisible ? <ChevronUpIcon className="w-5 h-5 mr-1" /> : <ChevronDownIcon className="w-5 h-5 mr-1" />}
          <span>{filtersVisible ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
        <div className='px-10 '>
        {filtersVisible && (
          <div className="w-full md:w-60 bg-white border rounded-lg border-gray-300 shadow-lg p-4 mb-4 md:mb-0 md:mr-4">
            <h3 className="font-semibold text-yellow-600 text-lg mb-4 text-center">Filters</h3>
            <div className="mb-4">
              <OrderFilter setFilters={setFilters} filters={filters} />
            </div>
            <div className="mb-4">
              <PriceFilter setFilters={setFilters} filters={filters} />
            </div>
            <div>
              <CategoriesFilter setFilters={setFilters} filters={filters} />
            </div>
          </div>
        )}
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredProducts.map((offer, index) => (
            <div
              key={index}
              className={`flex flex-col mx-2 md:mx-0 mb-10 bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${hoveredIndex === index ? 'shadow-lg' : ''}`}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleHover(-1)}
              onClick={() => goToDetail(offer)}
            >
              <div className="relative h-24 sm:h-32 overflow-hidden"> {/* Reduced height */}
                <img
                  className="w-full h-full object-cover"
                  src={hoveredIndex === index ? offer.image2 : offer.image1}
                  alt={offer.name}
                />
                <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-bl-lg">
                  {offer.category}
                </div>
              </div>
              <div className="p-2  flex flex-col flex-grow">
                <h3 className="font-semibold text-xs sm:text-sm mb-1">{offer.name}</h3> {/* Reduced font size */}
                <p className="text-gray-700 text-xs font-bold mb-2">${offer.price}</p> {/* Reduced font size */}
                <button className="text-white bg-blue-600 font-bold py-1 px-2 rounded-full transition duration-300 hover:bg-[#F2BB26] hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistributorComerce;