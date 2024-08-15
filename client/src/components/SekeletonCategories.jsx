
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategorySkeletonLoader = () => {
  return (
    <div className="cursor-pointer p-2 border rounded-md shadow-sm transition-colors duration-200">
      <Skeleton height={20} width={100} />
    </div>
  );
};

export default CategorySkeletonLoader;