'use client'

import React, { useContext, useState } from "react"
import { Link } from 'react-router-dom'

const SidebarContext = React.createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false)
  const [selectedButton, setSelectedButton] = useState("")

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen fixed left-0 top-10 z-10 w-[64px] group hover:w-64 transition-all duration-300 ease-in-out">
        <nav className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-amber-100/90 border-r border-amber-200/20 shadow-sm">
          <SidebarContext.Provider value={{ expanded, selectedButton, setSelectedButton }}>
            <ul className="flex-1 py-4 px-2 space-y-1">
              {children}
            </ul>
          </SidebarContext.Provider>
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-50 to-amber-100/90 border-t border-amber-200/20 shadow-lg z-50">
        <SidebarContext.Provider value={{ expanded: true, selectedButton, setSelectedButton }}>
          <ul className="flex justify-between items-center p-2">
            {children}
          </ul>
        </SidebarContext.Provider>
      </div>
    </>
  )
}

function SidebarItem({ icon, text, active, alert, notificationCount, onClick, link }) {
  const { expanded, selectedButton, setSelectedButton } = useContext(SidebarContext)
  const isSelected = selectedButton === text

  const handleItemClick = () => {
    setSelectedButton(text)
    if (onClick) onClick()
  }

  return (
    <li className="relative" onClick={handleItemClick}>
      <Link
        to={link}
        className={`
          relative flex items-center w-full rounded-lg text-sm font-medium
          transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap
          ${isSelected
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black'
            : active
              ? 'bg-amber-200/40 text-amber-900'
              : 'text-amber-900 hover:bg-amber-200/40 hover:text-amber-900'
          }
          md:h-12 h-14 md:justify-start justify-center
        `}
      >
        <div className="min-w-[48px] h-full flex items-center justify-center">
          {React.cloneElement(icon, {
            className: `w-5 h-5 ${isSelected ? 'text-black' : 'text-amber-700 group-hover:text-amber-900'}`
          })}
        </div>
        
        <span className="hidden md:inline-block pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {text}
        </span>

        {notificationCount > 0 && (
          <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {notificationCount}
          </div>
        )}
      </Link>
    </li>
  )
}

export { SidebarItem }