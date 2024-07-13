import React from 'react';
import 'animate.css';

const FloatingTutorialCard = ({ onClose }) => {
  return (
    <div className="fixed top-16 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-4 w-56 z-50 border border-gray-300 animate__animated animate__fadeInRight">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-black">Welcome to Bodega+</h2>
        <button onClick={onClose} className="text-black hover:text-gray-700 bg-transparent border-none p-1 rounded-full">
          <svg className="w-4 h-4 fill-current text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p className="text-black text-xs">
        You can start by adding a new category. Click the "Add Category" button to get started.
      </p>
    </div>
  );
};

export default FloatingTutorialCard;