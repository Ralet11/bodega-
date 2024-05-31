import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon, ArrowLeftOnRectangleIcon, CogIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { LiaCartPlusSolid } from "react-icons/lia";
import { Bars3BottomRightIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
const { API_URL_BASE } = getParamsEnv();
import { Dropdown, Ripple, initTE } from 'tw-elements';
import { emptyCart, logOutClient } from '../../redux/actions/actions';
import CartIcon from '../CartIcon';

initTE({ Dropdown, Ripple });

const Header = () => {
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state.client);
  const shop = client.locals.find((local) => local.id === activeShop);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const shopName = shop ? shop.name : "";

  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const isDistributorsCommerce = location.pathname === '/distributorsCommerce' || location.pathname === '/distProduct-detail';

  return (
    <header className='w-full fixed top-0 left-0 z-50 bg-[#F2BB26] md:bg-none md:pb-1 md:shadow-md'>
      <nav className='flex items-center justify-around p-2'>
        <div className='md:hidden flex items-center mr-2 md:pl-2'>
          <img
            src={isDistributorsCommerce ? 'https://res.cloudinary.com/doqyrz0sg/image/upload/v1716449453/product/q8a1uvpoigzjdfv8fh13.png' : 'https://res.cloudinary.com/doqyrz0sg/image/upload/v1716848833/bodgea_logo__1_chico-removebg-preview_1_uncx6r.png'}
            className={isDistributorsCommerce ? 'w-6 py-4' : ""}
          />
        </div>

        <div className={isDistributorsCommerce ? 'hidden md:block flex items-center pl-2' : 'hidden md:block pl-2'} >
          <img
            src='https://res.cloudinary.com/doqyrz0sg/image/upload/v1716669836/bodgea_logo_1_chico_ds9b92.png'
          />
        </div>

        {isDistributorsCommerce && (
          <div className='flex bg-white md:w-[800px] items-center justify-center shadow-lg'>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 text-base sm:text-1xl border-none sm:w-auto md:w-[780px]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="m-2 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        )}

        <div className={isDistributorsCommerce ? 'flex items-center justify-center space-x-4' : 'flex items-center md:ml-[85rem] justify-center space-x-4'}>
          <CartIcon />
          {isDistributorsCommerce && (
            <LiaCartPlusSolid className='w-6 h-6 hidden ' />
          )}

          <Bars3Icon ref={barsRef} className="w-6 h-6 text-gray-700 block sm:hidden" onClick={toggleDropdown} />
          <div className='relative hidden sm:flex items-center'>
            <span
              ref={triggerRef}
              onClick={toggleDropdown}
              className='p-2 font-bold text-xs sm:text-lg hover:text-indigo-500 rounded-xl cursor-pointer flex items-center bg-[#F2BB26] text-gray-700 hover:text-gray-900'
            >
              {shop ? shop.name : "Select Shop"}
              <ChevronDownIcon className='w-4 h-4 ml-1' />
            </span>
            {dropdownOpen && (
              <ul
                ref={dropdownRef}
                className="absolute text-xs sm:text-base right-0 md:right-6 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-20"
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
          {dropdownOpen && (
            <div className='relative sm:hidden'>
              <ul
                ref={dropdownRef}
                className="absolute text-xs sm:text-base right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-20"
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
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
