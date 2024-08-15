import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductDetailSkeletonLoader = () => {
  return (
    <div className="flex-none w-full lg:w-[300px] bg-white p-4 rounded-lg shadow-lg">
      <Skeleton height={160} />
      <div className="mt-4">
        <Skeleton height={20} width={150} />
        <Skeleton height={15} width={200} className="mt-2" />
        <Skeleton height={15} width={100} className="mt-2" />
      </div>
      <div className="mt-4 flex space-x-2">
        <Skeleton height={30} width={80} />
        <Skeleton height={30} width={80} />
        <Skeleton height={30} width={80} />
      </div>
    </div>
  );
};

export default ProductDetailSkeletonLoader;