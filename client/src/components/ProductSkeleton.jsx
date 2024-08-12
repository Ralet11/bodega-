import React from 'react';

function ProductSkeletonLoader() {
  return (
    <div className="animate-pulse p-4 rounded-lg shadow-lg bg-gray-200">
      <div className="w-full h-40 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </div>
  );
}

export default ProductSkeletonLoader;