import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-200 bg-opacity-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-yellow-500 border-opacity-75"></div>
        </div>
    );
};

export default Loader;
