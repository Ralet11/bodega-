import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bars3BottomRightIcon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  CogIcon,
  CalendarIcon,
  UserIcon
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

  const closeDropdown = () => {
    setDropdownOpen(false);
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

  console.log(shop);

  return (
    <header className='shadow-md w-full fixed top-0 left-0 z-10 bg-white'>
      <nav className='flex items-center justify-between bg-[#F2BB26] py-3 px-4 md:py-4 md:px-10'>
        {/* Logo section */}
        <div className='flex items-center'>
          <img src='https://res.cloudinary.com/doqyrz0sg/image/upload/v1716317107/bodegaicon_2-removebg-preview2_hwvlb3.png' alt='BodegaLogo' className='mb-1 w-6 h-8 md:w-8 md:h-10' />
          <span className='text-black ml-0.5 font-bold md:text-2xl'>odega+</span>
        </div>

        {/* Cart Icon always visible */}
        <div className='md:hidden flex items-center'>
          <CartIcon className='mr-3' />
        </div>

        {/* Mobile menu button */}
        <div className='md:hidden flex items-center'>
  <button className='bg-black p-2' onClick={toggleMenu}>
    {open ? <XMarkIcon className='text-yellow-300 w-5 h-5' /> : <Bars3BottomRightIcon className='text-yellow-300 w-5 h-5' />}
  </button>
</div>

        {/* Dropdown de Tailwind Elements */}
        {dropdownOpen && (
          <ul
            ref={dropdownRef}
            className="absolute ml-[-120px] mt-4 z-20 w-48 py-2 bg-white border border-gray-300 rounded-lg shadow-lg text-left text-sm transition duration-300 ease-in-out"
            aria-labelledby="dropdownMenuButton1"
            data-te-dropdown-menu-ref
            style={{ top: '100%', left: 'auto', right: '0' }}
          >
            <li>
              <Link
                className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
                to="/settings"
                data-te-dropdown-item-ref
                onClick={closeDropdown}
              >
                <CogIcon className="w-4 h-4 mr-2" />
                Shop Settings
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
                to="#"
                data-te-dropdown-item-ref
                onClick={closeDropdown}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Edit Availability
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
                to="#"
                data-te-dropdown-item-ref
                onClick={closeDropdown}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Account
              </Link>
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
                className='w-8 h-8 md:w-10 md:h-10 rounded-full'
                src={shop.img}
                alt={`Thumbnail of ${shop.name}`}
              />
            )}
          </li>
          <li className='flex items-center justify-center md:ml-3 md:justify-start w-full md:w-auto mt-4 md:mt-0 cursor-pointer font-bold'>
            {shop && shop.name}
            {shop && <ChevronDownIcon onClick={toggleDropdown} className='w-3 h-3 md:w-4 md:h-4 ml-1' />}
          </li>
          <li className='flex items-center justify-center md:justify-start w-full md:w-auto mt-4 md:mt-0'>
            <ArrowLeftOnRectangleIcon onClick={logOut} className='w-6 h-6 md:w-7 md:h-7 cursor-pointer' />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
