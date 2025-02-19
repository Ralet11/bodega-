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
      <aside className="hidden md:block h-screen fixed left-0 top-14 z-10 w-[56px] group hover:w-56 transition-all duration-300 ease-in-out">
        <nav className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-amber-100/90 border-r border-amber-200/20 shadow-sm">
          <SidebarContext.Provider value={{ expanded, selectedButton, setSelectedButton }}>
            <ul className="flex-1 py-2 px-2 space-y-1">
              {children}
            </ul>
          </SidebarContext.Provider>
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-50 to-amber-100/90 border-t border-amber-200/20 shadow-lg z-50">
        <SidebarContext.Provider value={{ expanded: true, selectedButton, setSelectedButton }}>
          <ul className="flex justify-between items-center p-1">
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
    <li className="relative pt-3" onClick={handleItemClick}>
      <Link
        to={link}
        className={`
          relative flex items-center w-full rounded-lg text-xs font-medium
          transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap
          ${isSelected
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black'
            : active
              ? 'bg-amber-200/40 text-amber-900'
              : 'text-amber-900 hover:bg-amber-200/40 hover:text-amber-900'
          }
          md:h-10 h-12 md:justify-start justify-center
        `}
      >
        <div className="min-w-[40px] h-full flex items-center justify-center">
          {React.cloneElement(icon, {
            className: `w-4 h-4 ${isSelected ? 'text-black' : 'text-amber-700 group-hover:text-amber-900'}`
          })}
        </div>
        
        <span className="hidden md:inline-block pr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
          {text}
        </span>

        {notificationCount > 0 && (
          <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {notificationCount}
          </div>
        )}
      </Link>
    </li>
  )
}

export { SidebarItem }
