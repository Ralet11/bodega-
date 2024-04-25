import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bars3BottomRightIcon,
  XMarkIcon,
  RocketLaunchIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';

// Importa los componentes de Tailwind Elements
import { Dropdown, Ripple, initTE } from 'tw-elements';

initTE({ Dropdown, Ripple });

const Header = () => {
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state.client);
  const shop = client.locals.find((local) => local.id === activeShop);

  let Links = [
    { name: `${shop.name}`, link: '/about' },
  ];
  let [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className='shadow-md w-full fixed top-0 left-0 z-[10]'>
      <div className='md:flex items-center justify-between bg-blue-400 py-4 md:px-10 px-7'>
        {/* logo section */}
        <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
          <RocketLaunchIcon className='w-7 h-7 text-white' />
          <span className='text-white'>Bodega+</span>
        </div>
        {/* Dropdown de Tailwind Elements */}
        <div
          className="relative cursor-pointer ml-[1100px]"
          data-te-dropdown-ref
        >
          <Cog8ToothIcon
            className='w-7 h-7 text-white mr-[-200px]'
            onClick={toggleDropdown}
          />
          {open && (
            <ul
              className={`absolute z-[99999] right-0 mt-1 w-48 py-2 bg-white border border-gray-300 rounded-lg shadow-lg text-left text-sm ${open ? 'block' : 'hidden'}`}
              aria-labelledby="dropdownMenuButton1"
              data-te-dropdown-menu-ref
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
        </div>
        {/* Fin del Dropdown de Tailwind Elements */}
        <ul
          className={` ml-[-200px] md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-blue-400 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? 'top-12' : 'top-[-490px]'
          }`}
        >
          <span className='bg-blue-400'>
            {shop.img && (
              <img
                className='w-10 h-10 rounded-full'
                src={`http://localhost:3000/${shop.img}`}
                alt={`Thumbnail of ${shop.name}`}
              />
            )}
          </span>

          {Links.map((link) => (
            <li className='md:ml-3 md:my-0 my-7 font-bold bg-blue-400' key={link.name}>
              {/* Use Link component instead of anchor tag */}
              <Link
                to={link.link}
                className='text-gray-800 hover:text-white duration-500'
              >
                
                  {link.name}
          
              </Link>
            </li>
          ))}
        </ul>
        {/* button */}
      </div>
    </div>
  );
};

export default Header;