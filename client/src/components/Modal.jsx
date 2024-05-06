import React from 'react';

const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg relative">
                <button onClick={onClose} className="absolute top-0 right-0 p-2">
                    X
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
