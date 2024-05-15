import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDistProd } from '../../redux/actions/actions';
import CommerceSidebar from '../CommerceSidebar/CommerceSidebar';
import OrderFilter from '../CommerceSidebar/OrderFilter';
import PriceFilter from '../CommerceSidebar/PriceFilter';
import CategoriesFilter from '../CommerceSidebar/CategoriesFilter';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';

const { API_URL_BASE } = getParamsEnv();

const DistributorComerce = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/distProducts/getAll`);
        setAllProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllProducts();
  }, []);

  const handleHover = (index) => setHoveredIndex(index);

  const goToDetail = (distProduct) => {
    dispatch(setDistProd(distProduct));
    navigate('/distProduct-detail');
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-100 pb-20">
      <div className="w-full max-w-screen-xl px-4">
        <CommerceSidebar />
      </div>
      <div className="flex justify-center w-full mt-8">
        <div className="w-full md:w-72 bg-white border rounded-lg border-gray-300 shadow-lg p-4 mr-4">
          <h3 className="font-semibold text-yellow-600 text-lg mb-4 text-center">Filters</h3>
          <div className="mb-4">
            <OrderFilter />
          </div>
          <div className="mb-4">
            <PriceFilter />
          </div>
          <div>
            <CategoriesFilter />
          </div>
          <div className="mt-4 flex justify-center">
            <button className="flex items-center bg-yellow-600 text-black font-bold py-2 px-3 rounded-lg transition duration-300 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50">
              <RocketLaunchIcon className="w-5 h-5 mr-1" />
              <span>Bodega+</span>
            </button>
          </div>
        </div>
        <div className="w-full max-w-screen-xl mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((offer, index) => (
            <div
              key={index}
              className={`flex flex-col bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${
                hoveredIndex === index ? 'shadow-lg' : ''
              }`}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleHover(-1)}
              onClick={() => goToDetail(offer)}
            >
              <div className="relative h-40 overflow-hidden">
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
                <h3 className="font-semibold text-md mb-1">{offer.name}</h3>
                <p className="text-gray-700 text-sm font-bold mb-2">${offer.price}</p>
                <button className="text-white bg-blue-600 font-bold py-1 px-3 rounded-full transition duration-300 hover:bg-[#F2BB26] hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50">
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