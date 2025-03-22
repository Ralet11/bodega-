"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { emptyCart, logOutClient } from "../../redux/actions/actions"

export default function Header({ isFirstScreen = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const activeShop = useSelector((state) => state.activeShop)
  const client = useSelector((state) => state?.client)
  const shop = client?.locals?.find((local) => local.id === activeShop)

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

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <img
                className="h-10 w-auto rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1726357397/logo_oe3idx.jpg"
                alt="Bodega Logo"
              />
            </a>

            {/* Menú de escritorio */}
            {!isFirstScreen && (
              <nav className="hidden ml-6 md:flex space-x-4">
                <button
                  onClick={() => navigate("/settings")}
                  className="text-black bg-amber-500 hover:bg-amber-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {shop?.name || "Select Shop"}
                </button>
              </nav>
            )}
          </div>

          {/* Menú de usuario (escritorio) */}
          <div className="hidden md:flex items-center">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-black bg-amber-500 hover:bg-amber-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {client?.client?.name || "User"}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {!isFirstScreen && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        navigate("/ClientSettings")
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100 w-full text-left"
                    >
                      Settings
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Botón del menú móvil (hamburguesa) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`bg-amber-500 text-white hover:bg-amber-600 p-2 rounded-md transition-colors duration-200 ${
                isMenuOpen ? "bg-amber-600" : "bg-amber-500"
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white shadow-lg rounded-md p-4 absolute top-16 left-0 right-0 z-20">
            {!isFirstScreen && (
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  navigate("/settings")
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-100 rounded-md transition-colors duration-200"
              >
                {shop?.name || "Select Shop"}
              </button>
            )}

            {!isFirstScreen && (
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  navigate("/ClientSettings")
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-100 rounded-md transition-colors duration-200"
              >
                Settings
              </button>
            )}

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
            >
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
