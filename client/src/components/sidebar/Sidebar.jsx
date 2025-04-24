import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

const SidebarContext = React.createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");

  return (
    <>
      {/* Sidebar para escritorio */}
      <aside className="hidden md:block h-screen fixed left-0 top-12 z-10 w-12 hover:w-48 transition-all duration-300 ease-in-out">
        <nav className="h-full flex flex-col bg-white border-r border-gray-100">
          <SidebarContext.Provider value={{ expanded, selectedButton, setSelectedButton }}>
            <ul className="flex-1 py-3 px-1.5 space-y-2">
              {children}
            </ul>
          </SidebarContext.Provider>
        </nav>
      </aside>

      {/* Navegación para mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <SidebarContext.Provider value={{ expanded: true, selectedButton, setSelectedButton }}>
          <ul className="flex justify-between items-center p-1">
            {children}
          </ul>
        </SidebarContext.Provider>
      </div>
    </>
  );
}

function SidebarItem({ icon, text, active, alert, notificationCount, onClick, link }) {
  const { expanded, selectedButton, setSelectedButton } = useContext(SidebarContext);
  const isSelected = selectedButton === text;

  const handleItemClick = () => {
    setSelectedButton(text);
    if (onClick) onClick();
  };

  return (
    <li className="relative" onClick={handleItemClick}>
      <Link
        to={link}
        className={`
          relative flex items-center rounded-md text-xs font-medium
          transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap
          ${isSelected ? "text-amber-600" : active ? "text-gray-800" : "text-gray-500 hover:text-gray-800"}
          md:h-9 h-12 md:justify-start justify-center
        `}
      >
        <div className="min-w-[36px] h-full flex items-center justify-center">
          {React.cloneElement(icon, {
            className: `w-[18px] h-[18px] ${isSelected ? "text-amber-600" : "text-inherit"}`,
          })}
        </div>

        {/* Se elimina el uso de "hidden" y "group-hover" para que el texto esté visible siempre */}
        <span className="inline-block pr-3 transition-opacity duration-300 text-xs">
          {text}
        </span>

        {notificationCount > 0 && (
          <div className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
            {notificationCount}
          </div>
        )}
      </Link>
    </li>
  );
}

export { SidebarItem };
