"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { emptyCart, logOutClient } from "../../redux/actions/actions"
import { ChevronDown, ShoppingBag } from "lucide-react"

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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex h-12 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <a href="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto rounded-full shadow-sm"
                src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1726357397/logo_oe3idx.jpg"
                alt="Bodega Logo"
              />
            </a>

            {/* Desktop menu */}
             {/* Desktop menu */}
             {!isFirstScreen && (
              <nav className="hidden md:flex">
                <button
                  onClick={() => navigate("/settings")}
                  className="text-gray-700 hover:text-amber-600 flex items-center text-sm font-medium"
                >
                  <ShoppingBag className="h-4 w-4 mr-1.5" />
                  <span>{shop?.name || "Select Shop"}</span>
                </button>
              </nav>
            )}
          </div>

          {/* User menu (desktop) */}
          <div className="hidden md:flex items-center">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-white hover:text-amber-100 flex items-center text-sm font-normal"
              >
                <span>{client?.client?.name || "User"}</span>
                <ChevronDown className="h-3 w-3 ml-1 text-amber-100" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-sm py-1 z-10 border border-gray-100 text-sm">
                  {!isFirstScreen && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        navigate("/ClientSettings")
                      }}
                      className="flex w-full items-center px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                    >
                      Settings
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1 rounded-md">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white shadow-sm absolute top-12 left-0 right-0 z-20 border-b border-gray-100">
            {!isFirstScreen && (
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  navigate("/settings")
                }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
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
                className="flex w-full items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
              >
                Settings
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
