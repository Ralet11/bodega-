import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { emptyCart, logOutClient } from '../../redux/actions/actions'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const activeShop = useSelector((state) => state.activeShop)
  const client = useSelector((state) => state?.client)
  const shop = client.locals.find((local) => local.id === activeShop)

  const handleLogout = () => {
    dispatch(logOutClient())
    dispatch(emptyCart())
    navigate("/login")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#f2BB26] to-amber-500 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between py-5">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <img
                className="h-10 w-auto rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1726357397/logo_oe3idx.jpg"
                alt="Bodega Logo"
              />
            </a>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <button
                onClick={() => navigate('/settings')}
                className="group inline-flex items-center rounded-full bg-amber-900 bg-opacity-10 px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-opacity-20 hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 transition-colors group-hover:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {shop?.name || 'Select Shop'}
              </button>
            </nav>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="relative ml-3" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center rounded-full bg-amber-900 bg-opacity-10 px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-600"
              >
                <span className="sr-only">Open user menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{client.client.name}</span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={() => navigate('/ClientSettings')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-amber-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center md:hidden" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md bg-amber-900 bg-opacity-10 p-2 text-white transition-colors hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <button
              onClick={() => navigate('/settings')}
              className="block w-full rounded-md bg-amber-900 bg-opacity-10 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-opacity-20"
            >
              {shop?.name || 'Select Shop'}
            </button>
            <button
              onClick={() => navigate('/ClientSettings')}
              className="block w-full rounded-md bg-amber-900 bg-opacity-10 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-opacity-20"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full rounded-md bg-red-600 bg-opacity-20 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-opacity-20"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

