import React, { useState } from 'react';

const FilterButtons = ({ filterOrders, showAllOrders }) => {
  const [selected, setSelected] = useState(null);

  const handleButtonClick = (period) => {
    setSelected(period);
    filterOrders(period);
  };

  return (
    <div className="mt-4 flex justify-center space-x-2">
      <button
        onClick={() => handleButtonClick('day')}
        className={`text-sm font-semibold px-4 py-2 rounded-md border border-black transition-colors duration-200 ${selected === 'day' ? 'bg-[#F2BB26] text-white' : 'bg-transparent text-black hover:bg-[#F2BB26] hover:text-white'}`}
      >
        Day
      </button>
      <button
        onClick={() => handleButtonClick('month')}
        className={`text-sm font-semibold px-4 py-2 rounded-md border border-black transition-colors duration-200 ${selected === 'month' ? 'bg-[#F2BB26] text-white' : 'bg-transparent text-black hover:bg-[#F2BB26] hover:text-white'}`}
      >
        Month
      </button>
      <button
        onClick={() => handleButtonClick('trimester')}
        className={`text-sm font-semibold px-4 py-2 rounded-md border border-black transition-colors duration-200 ${selected === 'trimester' ? 'bg-[#F2BB26] text-white' : 'bg-transparent text-black hover:bg-[#F2BB26] hover:text-white'}`}
      >
        Trimester
      </button>
      <button
        onClick={() => handleButtonClick('semester')}
        className={`text-sm font-semibold px-4 py-2 rounded-md border border-black transition-colors duration-200 ${selected === 'semester' ? 'bg-[#F2BB26] text-white' : 'bg-transparent text-black hover:bg-[#F2BB26] hover:text-white'}`}
      >
        Semester
      </button>
      <button
        onClick={() => handleButtonClick('year')}
        className={`text-sm font-semibold px-4 py-2 rounded-md border border-black transition-colors duration-200 ${selected === 'year' ? 'bg-[#F2BB26] text-white' : 'bg-transparent text-black hover:bg-[#F2BB26] hover:text-white'}`}
      >
        Year
      </button>
      <button
        onClick={() => { setSelected('historical'); showAllOrders(); }}
        className={`text-sm font-semibold px-4 py-2 rounded-md border border-black transition-colors duration-200 ${selected === 'historical' ? 'bg-[#F2BB26] text-white' : 'bg-transparent text-black hover:bg-[#F2BB26] hover:text-white'}`}
      >
        Historical Data
      </button>
    </div>
  );
};

export default FilterButtons;
