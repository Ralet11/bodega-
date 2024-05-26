import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowLeftOnRectangleIcon, CogIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { getParamsEnv } from '../../functions/getParamsEnv';
import CartIcon from '../CartIcon';

const { API_URL_BASE } = getParamsEnv();
import { Dropdown, Ripple, initTE } from 'tw-elements';
import { emptyCart, logOutClient } from '../../redux/actions/actions';

initTE({ Dropdown, Ripple });

const Header = () => {
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state.client);
  const shop = client.locals.find((local) => local.id === activeShop);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shopName = shop ? shop.name : "";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !triggerRef.current.contains(event.target)) {
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

  return (
    <header className='w-full fixed top-0 left-0 z-50 bg-[#F2BB26] shadow-md'>
      <nav className='mx-5 flex items-center justify-between p-0.3 md:p-1'>
        <div className='flex items-center'>
          <img src='https://res.cloudinary.com/doqyrz0sg/image/upload/v1716669836/bodgea_logo_1_chico_ds9b92.png' alt='BodegaLogo' className='w-[110%]' />
          {/* <span className='text-gray-900 ml-0.5 md:text-xl font-semibold'>odega+</span> */}
        </div>

        <div className='flex items-center md:gap-3'>
          {shop && shop.img && (
            <img className='w-6 md:w-8 md:h-8 h-6 rounded-full' src={shop.img} alt={`Thumbnail of ${shop.name}`} />
          )}
          <div className='relative'>
            <span
              ref={triggerRef}
              onClick={toggleDropdown}
              className='p-2 font-bold text-xs md:text-lg hover:text-indigo-500 rounded-xl cursor-pointer flex items-center bg-[#F2BB26] text-gray-700 hover:text-gray-900'
            >
              {shop ? shop.name : "Select Shop"}
              <ChevronDownIcon className='w-4 h-4 ml-1' />
            </span>
            {dropdownOpen && (
              <ul
                ref={dropdownRef}
                className="absolute text-xs md:text-base right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-20"
              >
                <li>
                  <Link
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    to="/settings"
                  >
                    <CogIcon className="w-4 h-4 mr-2 inline-block" />
                    Shop Settings
                  </Link>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={logOut}
                  >
                    <ArrowLeftOnRectangleIcon className='w-4 h-4 mr-2 inline-block' />
                    Log Out
                  </button>
                </li>
              </ul>
            )}
          </div>
          <CartIcon className='text-gray-700 hover:text-gray-900' />
        </div>
      </nav>
    </header>
  );
};

export default Header;