import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { setDistProd, setSubcategories, setFindedProducts, setSelectedSubCategory, setAllDistProducts } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';
import HeadSlider from '../sliders/HeadSlider';
import CartIcon from '../CartIcon';
import ProductSlider from '../sliders/OfertSlider';
import ProductSlider2 from '../sliders/ofertSilder2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { API_URL_BASE } = getParamsEnv();

const DistributorComerce = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const token = useSelector((state) => state?.client.token);
  const client = useSelector((state) => state?.client.client);
  const subcategories = useSelector((state) => state?.subcategories);
  const [filters, setFilters] = useState({
    order: 'newest',
    price: 50,
    categories: [],
    searchTerm: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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
        dispatch(setAllDistProducts(response.data));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [token]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/subcategories/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setSubcategories(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubcategories();
  }, [dispatch, token]);

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const groupedSubcategories = Array.isArray(subcategories) ? chunkArray(subcategories, 10) : [];

  const handleSelectSubCategory = (id) => {
    const filtered = allProducts.filter(product => product.subcategory_id === id);
    dispatch(setSelectedSubCategory(id));
    dispatch(setFindedProducts(filtered));
    navigate("/searchProducts");
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-200 pb-20">
      <div className="md:hidden flex text-xs mt-20 bg-[#F2BB26] pt-4 font-bold px-3 gap-1 w-full">
        <MapPinIcon className="w-4 h-4" />
        <p>Send to Calle 1234</p>
      </div>
      <HeadSlider />
      <div className="shadow-md mt-5 p-1 px-6 font-bold rounded bg-white w-4/5 md:w-auto md:text-lg">
        <p className="text-xs md:text-base">
          <span className="text-green-500">Free Delivery</span> on all products from $1.000
        </p>
      </div>
      <div className="w-full max-w-6xl mt-8">
        <Slider {...sliderSettings}>
          {loading ? (
            <Skeleton count={1} height={200} />
          ) : (
            groupedSubcategories.map((group, index) => (
              <div key={index}>
                <div className="grid grid-cols-5 gap-4">
                  {group.map((subcategory, idx) => (
                    <div key={idx} onClick={() => handleSelectSubCategory(subcategory.id)} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
                      <img className="w-full h-20 object-cover" src={subcategory.imagen} alt={subcategory.name} />
                      <div className="p-2">
                        <h3 className="font-bold text-xs text-gray-800">{subcategory.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </Slider>
      </div>
      <ProductSlider />
      <ProductSlider2 />
      <div className="flex flex-col px-2 justify-center w-full md:w-[80%] mt-8">
        <h2 className="text-base font-bold text-gray-800 mb-1 md:mt-4">Find your products</h2>
        <div className="mt-8 flex flex-col justify-center items-center">
          {loading ? (
            <Skeleton count={5} height={150} width={330} className="mb-2" />
          ) : (
            Array.isArray(allProducts) && allProducts.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-xs md:text-2xl text-center font-bold text-gray-700">Products not found</h1>
              </div>
            ) : (
              Array.isArray(allProducts) && allProducts.map((product, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row justify-center items-center w-[280px] md:w-full mb-4 border h-auto md:max-h-[12rem] bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${hoveredIndex === index ? 'shadow-lg' : ''}`}
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => handleHover(-1)}
                  onClick={() => goToDetail(product)}
                >
                  <div className="relative w-full md:w-1/3 overflow-hidden">
                    <img
                      className="w-full h-32 object-contain md:w-full md:h-32 transition-transform duration-500 transform hover:scale-110"
                      src={hoveredIndex === index ? product.image2 : product.image1}
                      alt={product.name}
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between w-full">
                    <h3 className="font-semibold text-sm md:text-lg text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                      <p className="text-3xl font-bold text-gray-700">${product.price.toFixed(2)}</p>
                      <span className="line-through text-gray-400 text-md">${(product.price * 1.1).toFixed(2)}</span>
                      <span className="text-red-500 text-lg font-bold">10% OFF</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 text-center">{product.store}</p>
                    {product.freeShipping && (
                      <p className="text-green-500 text-xs font-semibold text-center">Free delivery</p>
                    )}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4">
                      <button className="py-1 md:py-2 px-2 md:px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 mb-2 md:mb-0">
                        Add to Cart
                      </button>
                      <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-0">Availability: <span className="text-green-500">In Stock</span></p>
                      <button className="text-gray-500 hover:text-red-500 transition-colors duration-300">
                        <HeartIcon className="w-4 md:w-6 h-4 md:h-6" />
                      </button>
                    </div>
                    <div className="flex items-center mt-4">
                      <span className="text-yellow-500 flex items-center">
                        {Array.from({ length: product.rating }, (_, i) => (
                          <svg key={i} className="w-3 md:w-4 h-3 md:h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributorComerce;