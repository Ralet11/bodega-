import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon, CogIcon, Bars3Icon, ArrowPathIcon } from '@heroicons/react/24/solid'; // Icono de sincronización
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

  console.log(client, "shop");

  const shopName = shop ? shop.name : "";
  const shopImage = shop?.img || 'https://via.placeholder.com/50';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus, setSyncStatus] = useState('green'); // Estado para el color del botón de sincronización
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const barsRef = useRef(null);
  const token = useSelector((state) => state?.client.token);

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

  console.log(token, "token");

  const handleSyncClick = async () => {
    setIsLoading(true); // Mostrar loader al iniciar la solicitud
  
    try {
      // Realiza la solicitud a la ruta de sincronización
      const response = await axios.post(
        `${API_URL_BASE}/api/local/syncLocal`, 
        {}, // Cuerpo vacío
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 200) {
        // Si la sincronización fue exitosa, cambia el botón a verde
        setSyncStatus('green');
      }
    } catch (error) {
      console.error('Error during sync:', error);
      // Si hay un error, cambia el botón a rojo
      setSyncStatus('red');
    } finally {
      setIsLoading(false); // Ocultar loader al finalizar la solicitud
    }
  };
  
  const isDistributorsCommerce = location.pathname === '/distributorsCommerce' || location.pathname === '/distProduct-detail' || location.pathname === '/searchProducts';

  return (
    <header className='w-full fixed top-0 left-0 z-50 bg-[#F2BB26] md:bg-none md:pb-1 md:shadow-md'>
      <nav className='flex items-center justify-between p-2'>
        <div className='flex items-center'>
          {/* Logo de Bodega */}
          <img
            src='https://res.cloudinary.com/doqyrz0sg/image/upload/v1720237489/bodgea_logo_grande_k12lfy.png'
            alt='Bodega Logo'
            className='w-[133px] h-[38px]'
          />
        </div>

        <div className='flex items-center text-sm space-x-4'>
          {/* Botón de Sincronización o Loader */}
          {isLoading ? (
            <div className="flex items-center">
              {/* Loader simple (spinner) */}
              <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
          ) : (
            <div className="flex items-center cursor-pointer hover:text-green-500" onClick={handleSyncClick}>
              <ArrowPathIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>Sync with App</span>
            </div>
          )}

          {/* Nombre del Shop y su Imagen */}
          <div className='flex items-center cursor-pointer' onClick={handleShopClick}>
            <span className='font-bold mr-2'>{shopName}</span>
            {shop && (
              <img
                src={shopImage}
                alt='Shop Logo'
                className='w-6 h-6 rounded-full border border-gray-300'
              />
            )}
          </div>

          {/* Barra vertical */}
          <div className='h-6 border-r border-gray-400'></div>

          {/* Nombre del User */}
          <div className='flex items-center'>
            <span className='font-bold'>{client.client.name}</span>
          </div>

          {/* Barra vertical */}
          <div className='h-6 border-r border-gray-400'></div>

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