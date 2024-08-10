import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon, CogIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { LiaCartPlusSolid } from "react-icons/lia";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
const { API_URL_BASE } = getParamsEnv();
import { Dropdown, Ripple, initTE } from 'tw-elements';
import { emptyCart, logOutClient } from '../../redux/actions/actions';
import CartIcon from '../CartIcon';
import { setFindedProducts } from '../../redux/actions/actions';

initTE({ Dropdown, Ripple });

const Header = () => {
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state?.client);
  const shop = client.locals.find((local) => local.id === activeShop);
  const findedProducts = useSelector((state) => state?.findedProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(client, "shop")

  const shopName = shop ? shop.name : "";
  const shopOwner = "User Name Hardcoded";
  const shopImage = shop?.img || 'https://via.placeholder.com/50'; 

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const barsRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !triggerRef.current.contains(event.target) && !barsRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  const logOut = () => {
    dispatch(logOutClient());
    dispatch(emptyCart());
    navigate("/login");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = async (event) => {
    if (event.key === 'Enter') {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/distProducts/search`, {
          params: { query: searchQuery },
        });
        console.log(response.data);
        dispatch(setFindedProducts(response.data.results));
        navigate("/searchProducts");
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  const handleShopClick = () => {
    navigate('/settings');
  };

  const isDistributorsCommerce = location.pathname === '/distributorsCommerce' || location.pathname === '/distProduct-detail' || location.pathname === '/searchProducts';

  console.log(findedProducts);

  return (
    <header className='w-full fixed top-0 left-0 z-50 bg-[#F2BB26] md:bg-none md:pb-1 md:shadow-md'>
      <nav className='flex items-center justify-between p-1'>
        <div className='flex items-center'>
          {/* Logo de Bodega */}
          <img
            src='https://res.cloudinary.com/doqyrz0sg/image/upload/v1720237489/bodgea_logo_grande_k12lfy.png'
            alt='Bodega Logo'
            className='w-[133px] h-[38px]'
          />
        </div>

        <div className='flex items-center text-sm'> {/* Reducido el tamaño de la fuente */}
          {/* Nombre del Shop y su Imagen */}
          <div className='flex items-center cursor-pointer' onClick={handleShopClick}>
            <span className='font-bold mr-2'>{shopName}</span>
            {shop && <img
              src={shopImage}
              alt='Shop Logo'
              className='w-6 h-6 rounded-full border border-gray-300' // Tamaño reducido
            />}
          </div>

          {/* Barra vertical */}
          <div className='mx-4 h-6 border-r border-gray-400'></div>

          {/* Nombre del User */}
          <div className='flex items-center'>
            <span className='mr-2 font-bold'>{client.client.name}</span>
          </div>

          {/* Barra vertical */}
          <div className='mx-4 h-6 border-r border-gray-400'></div>

          {/* Log Out */}
          <div className='flex items-center cursor-pointer' onClick={logOut}>
            <span className='mr-1 font-bold'>Log Out</span>
            <ArrowRightOnRectangleIcon className='w-5 h-5 text-gray-700' />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;