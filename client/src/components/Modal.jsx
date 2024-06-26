import React from 'react';

const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full md:max-w-4xl relative p-6">
                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;