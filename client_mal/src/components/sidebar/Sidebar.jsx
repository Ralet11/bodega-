import React, { useContext, useState } from "react";
import PropTypes from 'prop-types';
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const SidebarContext = React.createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedButton, setSelectedButton] = useState(""); // Estado para el botón seleccionado

  return (
    <aside className="h-screen" style={{ marginTop: '66px', height: "91.3%", position: "fixed", left: 0, top: "1.01%", zIndex: 10 }}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded, selectedButton, setSelectedButton }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <UserCircleIcon />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Cliente2</h4>
              <span className="text-xs text-gray-600">clientePrueba2@example.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

// PropTypes for Sidebar component
Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
}
export function SidebarItem({ icon, text, active, alert, notificationCount, onClick }) {
  const { expanded, selectedButton, setSelectedButton } = useContext(SidebarContext);

  const handleItemClick = () => {
    setSelectedButton(text); // Actualizar el botón seleccionado
    if (onClick) {
      onClick(); // Llamar a la función de clic proporcionada
    }
  };

  const isSelected = selectedButton === text;

  const buttonClasses = `
    relative flex items-center py-2 px-3 my-1
    font-medium rounded-md cursor-pointer
    transition-colors group
    ${
      isSelected
        ? "text-blue-500" // Cambio de color cuando está seleccionado
        : active
        ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800"
        : "hover:bg-blue-50 text-gray-600"
    }
  `;

  return (
    <li className={buttonClasses} onClick={handleItemClick}>
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "ml-3" : "w-0"}`}>
        {text}
      </span>
      {notificationCount > 0 && (
        <div className={`absolute right-2 top-1 w-4 h-4 rounded-full bg-red-500 ${expanded ? "" : "top-2"}`}>
          <span className="text-white text-xs font-semibold flex items-center justify-center h-full">
            {notificationCount}
          </span>
        </div>
      )}

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

// PropTypes for SidebarItem component
SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  alert: PropTypes.bool,
  notificationCount: PropTypes.number,
  onClick: PropTypes.func, // Agrega un prop para manejar clics
};