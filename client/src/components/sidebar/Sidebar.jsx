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

  const handleIconClick = () => {
    setShowMore(false);
  };

  return (
    <>
      <aside className="hidden rounded rounded-lg md:block h-screen" style={{ marginTop: '50px', height: "91.3%", position: "fixed", left: 0, top: "1.01%", zIndex: 10 }}>
        <nav className="h-full rounded rounded-lg pt-5 flex flex-co md:bg-white md:bg-none bg-gradient-to-b from-gray-200 via-[#F2BB26] to-[#F2BB26] border-r shadow-sm">
          <SidebarContext.Provider value={{ expanded, selectedButton, setSelectedButton, handleIconClick }}>
            <ul className="flex-1 px-3">
              {childrenArray}
            </ul>
          </SidebarContext.Provider>
        </nav>
      </aside>

      <div className="md:hidden fixed bottom-0 w-full bg-gradient-to-b from-gray-200 to-[#F2BB26] border-t shadow-sm z-50">
        <SidebarContext.Provider value={{ expanded: true, selectedButton, setSelectedButton, handleIconClick }}>
          <ul className="flex justify-between items-center flex-nowrap">
            {visibleChildren}
            {hiddenChildren.length > 0 && (
              <>
                <SidebarItem
                  icon={showMore ? <X /> : <MoreVertical />}
                  text={showMore ? "Less" : "More"}
                  onClick={() => setShowMore(!showMore)}
                  isMoreButton={true}
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

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

function SidebarItem({ icon, text, active, alert, notificationCount, onClick, link, isMoreButton }) {
  const { expanded, selectedButton, setSelectedButton, handleIconClick } = useContext(SidebarContext);

  const handleItemClick = () => {
    setSelectedButton(text);
    if (onClick) {
      onClick();
    }
    if (!isMoreButton) {
      handleIconClick();
    }
  };

  const isSelected = selectedButton === text;

  const buttonClasses = `
    relative flex flex-col items-center justify-center p-1 md:p-3
    font-medium rounded-md cursor-pointer
    transition-colors group
    ${
      isSelected
        ? "text-yellow-500"
        : active
        ? "bg-gradient-to-tr from-yellow-200 to-yellow-100 text-black"
        : "hover:bg-yellow-50 text-gray-600"
    }
  `;

  return (
    <li className={buttonClasses} onClick={handleItemClick}>
      <Link to={link} className="flex flex-col items-center relative">
        {React.cloneElement(icon, { className: 'h-6 w-6 mb-1 text-black' })}
        <span className="tooltip md:absolute md:left-full md:ml-8 md:whitespace-no-wrap md:invisible md:opacity-0 md:group-hover:visible group-hover:opacity-100 transition-opacity duration-300 md:bg-yellow-300/40 text-black md:text-base font-semibold text-xs rounded-md md:px-2 md:py-1">
          {text}
        </span>
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

SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  alert: PropTypes.bool,
  notificationCount: PropTypes.number,
  onClick: PropTypes.func,
  link: PropTypes.string.isRequired,
  isMoreButton: PropTypes.bool,
};

SidebarItem.defaultProps = {
  isMoreButton: false,
};

export { SidebarItem };
