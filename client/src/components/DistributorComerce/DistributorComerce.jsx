import React, { useEffect, useState } from 'react';
import CommerceSidebar from '../CommerceSidebar/CommerceSidebar';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';
import { Button } from '@material-tailwind/react';
import {
  EyeIcon
} from '@heroicons/react/24/solid';
import { getParamsEnv } from '../../functions/getParamsEnv';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setDistProd } from '../../redux/actions/actions';
import CartIcon from '../CartIcon';
import OrderFilter from '../CommerceSidebar/OrderFilter';
import PriceFilter from '../CommerceSidebar/PriceFilter';
import CategoriesFilter from '../CommerceSidebar/CategoriesFilter';
import TopProducts from '../card/CardTopProduct';
import {

  RocketLaunchIcon,
  
} from '@heroicons/react/24/solid';

const {API_URL_BASE} = getParamsEnv()

const DistributorComerce = () => {

  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState()
  const [product, setProduct] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/distProducts/getAll`)
        console.log(response)
        setAllProducts(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllProducts()
  },[])

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  const goToDetail = (distProduct) => {
    dispatch(setDistProd(distProduct))
    navigate('/distProduct-detail');
  }

  return (
    <div className="flex flex-col items-center w-full bg-gray-200">
      <div className='flex flex-col w-2/3'>
        <CommerceSidebar />
      </div>

      <div className="flex justify-evenly w-full mt-8 cursor-pointer">
      <div className="h-full w-[300px] bg-white border-l rounded-lg border-gray-200 shadow-lg flex flex-col justify-between">
  <div>
  <div className="flex justify-center border-r border-gray-200">
    <h3 className="pt-4 font-semibold text-yellow-600 mb-8 text-2xl">Filters</h3>
  </div>
    
    <OrderFilter className="mb-4" />
    <PriceFilter />
    <CategoriesFilter />
  </div>
  
  <div className="flex flex-col justify-center border-r border-gray-200">
    <h3 className="pt-4 text-center font-semibold text-yellow-600 mb-8 text-2xl">Top products</h3>
    <TopProducts />
  </div>
  
  <div className="font-bold text-2xl bg-yellow-600 p-4 cursor-pointer flex items-center justify-center gap-1">
    <RocketLaunchIcon className="w-7 h-7 text-black" />
    <span className="text-black font-bold">Bodega+</span>
  </div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {allProducts && allProducts.map((offer, index) => (
            <div 
              key={index} 
              className={`flex flex-col justify-between bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg w-64 ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleHover(-1)}
              onClick={() => goToDetail(offer)}
            >
              <div className="relative">
                <img className="w-full h-32 object-cover rounded-lg object-center transition-transform duration-300 transform-gpu" src={hoveredIndex === index ? offer.image2 : offer.image1} alt={offer.name} />
                <div className="absolute top-0 right-0 p-2 bg-gray-800 text-white rounded-bl-lg">
                  <span>{offer.category}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{offer.name}</h3>
                <p className="text-black font-bold text-2xl mb-2">${offer.price}</p>
              </div>
              <div className="flex justify-center">
                <button className="px-6 mb-2 font-bold rounded-full bg-white text-yellow-600 hover:bg-yellow-600 border border-white hover:text-white">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
        

        
      </div>
    </div>
  );
}

export default DistributorComerce;
