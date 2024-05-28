import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDistProd } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { MapPinIcon } from '@heroicons/react/24/outline';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';
import HeadSlider from '../sliders/HeadSlider';

const { API_URL_BASE } = getParamsEnv();

const DistributorComerce = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const token = useSelector((state) => state?.client.token);
  const client = useSelector((state) => state?.client.client);
  const [filters, setFilters] = useState({
    order: 'newest',
    price: 50,
    categories: [],
    searchTerm: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

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
    <div className="flex flex-col items-center w-full bg-gray-200 pb-20">
      <SearchBarCommerce setFilters={setFilters} filters={filters} />
      <div className="flex text-xs bg-[#F2BB26] font-bold px-3 gap-1 w-full mt-16">
        <MapPinIcon className="w-4 h-4" />
        <p>Send to Calle 1234</p>
      </div>
      <HeadSlider />
      <div className="shadow-md p-1 px-6 font-bold rounded bg-white">
        <p className="text-xs">
          <span className="text-green-500">Free Delivery</span> in all products from $1.000
        </p>
      </div>
      <div className="flex flex-col px-2 md:flex-row justify-center w-full md:w-[80%] mt-8">
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:w-[940px] flex justify-center items-center h-full">
              <h1 className="text-xl text-start font-bold text-gray-700">Products not found</h1>
            </div>
          ) : (
            filteredProducts.map((offer, index) => (
              <div
                key={index}
                className={`flex flex-col max-h-[240px] mx-2 md:mx-0 mb-10 bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${hoveredIndex === index ? 'shadow-lg' : ''}`}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => handleHover(-1)}
                onClick={() => goToDetail(offer)}
              >
                <div className="relative h-36 sm:h-48 overflow-hidden"> {/* Adjusted height */}
                  <img
                    className="w-full h-full object-cover"
                    src={hoveredIndex === index ? offer.image2 : offer.image1}
                    alt={offer.name}
                  />
                  <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-bl-lg">
                    {offer.category}
                  </div>
                </div>
                <div className="p-2 flex flex-col flex-grow">
                  <h3 className="font-semibold text-xs sm:text-sm mb-1">{offer.name}</h3>
                  <p className="text-gray-700 text-lg font-bold mb-2">${offer.price}</p>
                  <button className="text-white bg-blue-600 font-bold py-1 px-2 rounded-full transition duration-300 hover:bg-[#F2BB26] hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50">
                    Add to cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributorComerce;
