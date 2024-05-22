import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bars3BottomRightIcon,
  XMarkIcon,
  RocketLaunchIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/solid';
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

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const toggleDropdown = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom, left: rect.left });
    setDropdownOpen(!dropdownOpen);
  };

  const logOut = () => {
    dispatch(logOutClient());
    dispatch(emptyCart());
    navigate("/login");
  };

  useEffect(() => {
    if (dropdownOpen && dropdownRef.current) {
      const dropdownMenu = dropdownRef.current;
      dropdownMenu.style.top = `${dropdownPosition.top}px`;
      dropdownMenu.style.left = `${dropdownPosition.left}px`;
    }
  }, [dropdownOpen, dropdownPosition]);

  return (
    <div className='shadow-md w-full fixed top-0 left-0 z-10'>
      <div className='flex items-center justify-between bg-[#F2BB26] py-4 px-5 md:px-10'>
        {/* Logo section */}
        <div className='flex items-center'>
          <img src='https://res.cloudinary.com/doqyrz0sg/image/upload/v1716317107/bodegaicon_2-removebg-preview2_hwvlb3.png' alt='BodegaLogo' className='mb-1 w-8 h-10' />
          <span className='text-black font-bold text-2xl'> odega+</span>
        </div>

        {/* Cart Icon always visible */}
        <div className='md:hidden flex items-center'>
          <CartIcon className='mr-4' />
        </div>

        {/* Mobile menu button */}
        <div className='md:hidden flex items-center'>
          <button onClick={toggleMenu}>
            {open ? <XMarkIcon className='w-6 h-6' /> : <Bars3BottomRightIcon className='w-6 h-6' />}
          </button>
        </div>

        {/* Dropdown de Tailwind Elements */}
        {dropdownOpen && (
          <ul
            ref={dropdownRef}
            className="absolute z-50 w-48 py-2 bg-white border border-gray-300 rounded-lg shadow-lg text-left text-sm"
            aria-labelledby="dropdownMenuButton1"
            data-te-dropdown-menu-ref
            style={{ top: '100%', left: 'auto', right: '0' }}
          >
            <li>
              <a
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                href="/settings"
                data-te-dropdown-item-ref
              >
                Shop Settings
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                href="#"
                data-te-dropdown-item-ref
              >
                Edit Availability
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                href="#"
                data-te-dropdown-item-ref
              >
                Account
              </a>
            </li>
          </ul>
        )}

        {/* Menu items */}
        <ul
          className={`flex flex-col md:flex-row md:items-center md:static absolute w-full md:w-auto bg-[#F2BB26] md:bg-transparent left-0 transition-all duration-500 ease-in ${open ? 'top-16 opacity-100' : 'top-[-490px] opacity-0 md:opacity-100'
            }`}
        >
          <li className='hidden md:flex items-center md:pr-5 justify-center md:justify-start w-full md:w-auto'>
            <CartIcon />
          </li>
          <li className='flex items-center justify-center md:justify-start w-full md:w-auto mt-4 md:mt-0'>
            {shop && shop.img && (
              <img
                className='w-10 h-10 rounded-full'
                src={`${API_URL_BASE}/${shop.img}`}
                alt={`Thumbnail of ${shop.name}`}
              />
            )}
          </li>
          <li className='flex items-center justify-center md:ml-3 md:justify-start w-full md:w-auto mt-4 md:mt-0 cursor-pointer font-bold'>
            {shop && shop.name}
            {shop && <ChevronDownIcon onClick={toggleDropdown} className='w-4 h-4 ml-1' />}
          </li>
          <li className='flex items-center justify-center md:justify-start w-full md:w-auto mt-4 md:mt-0'>
            <ArrowLeftOnRectangleIcon onClick={logOut} className='w-7 h-7 cursor-pointer' />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
