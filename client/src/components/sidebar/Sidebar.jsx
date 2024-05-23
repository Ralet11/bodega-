import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { MoreVertical, X } from "lucide-react";
import { Link } from 'react-router-dom';

const SidebarContext = React.createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");
  const [showMore, setShowMore] = useState(false);
  const moreMenuRef = useRef(null);

  // Split children into visible and hidden icons
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, 4); // Display 4 icons initially
  const hiddenChildren = childrenArray.slice(4); // Rest of the icons

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMore && moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMore(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMore]);

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="hidden md:block h-screen" style={{ marginTop: '66px', height: "91.3%", position: "fixed", left: 0, top: "1.01%", zIndex: 10 }}>
        <nav className="h-full pt-5 flex flex-col bg-white border-r shadow-sm">
          
          <SidebarContext.Provider value={{ expanded, selectedButton, setSelectedButton }}>
            <ul className="flex-1 px-3">
              {childrenArray}
            </ul>
          </SidebarContext.Provider>

        </nav>
      </aside>

      {/* Bottom bar for mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-sm z-50">
        <SidebarContext.Provider value={{ expanded: true, selectedButton, setSelectedButton }}>
          <ul className="flex justify-between items-center p-2 flex-nowrap">
            {visibleChildren}
            {hiddenChildren.length > 0 && (
              <>
                <SidebarItem
                  icon={showMore ? <X /> : <MoreVertical />}
                  text={showMore ? "Less" : "More"}
                  onClick={() => setShowMore(!showMore)}
                />
                {showMore && (
                  <div ref={moreMenuRef} className="absolute bottom-full mb-2 w-full flex justify-around bg-white shadow-lg p-2 border-t">
                    {hiddenChildren}
                  </div>
                )}
              </>
            )}
          </ul>
        </SidebarContext.Provider>
      </div>
    </>
  );
}

// PropTypes for Sidebar component
Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SidebarItem({ icon, text, active, alert, notificationCount, onClick, link }) {
  const { expanded, selectedButton, setSelectedButton } = useContext(SidebarContext);

  const handleItemClick = () => {
    setSelectedButton(text);
    if (onClick) {
      onClick();
    }
  };

  const isSelected = selectedButton === text;

  const buttonClasses = `
    relative flex flex-col items-center justify-center p-2
    font-medium rounded-md cursor-pointer
    transition-colors group
    ${
      isSelected
        ? "text-blue-500"
        : active
        ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-black"
        : "hover:bg-blue-50 text-gray-600"
    }
  `;

  return (
    <li className={buttonClasses} onClick={handleItemClick}>
      <Link to={link} className="flex flex-col items-center">
        {React.cloneElement(icon, { className: 'h-6 w-6 mb-1' })}
        <span className="text-xs">{text}</span>
        {notificationCount > 0 && (
          <div className="absolute right-2 top-1 w-4 h-4 rounded-full bg-red-500">
            <span className="text-white text-xs font-semibold flex items-center justify-center h-full">
              {notificationCount}
            </span>
          </div>
        )}
      </Link>
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
  onClick: PropTypes.func,
  link: PropTypes.string.isRequired,
};