import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Skeleton for the header */}
      <div className="text-center bg-gray-200 text-black p-6 mb-6 rounded-lg shadow-lg" style={{ marginTop: '120px' }}>
        <Skeleton height={40} width={300} style={{ marginBottom: '10px' }} />
        <Skeleton height={20} width={250} />
      </div>

      {/* Skeleton for the button group */}
      <div className="flex justify-center mb-6">
        <Skeleton height={40} width={100} style={{ marginRight: '10px' }} />
        <Skeleton height={40} width={100} style={{ marginRight: '10px' }} />
        <Skeleton height={40} width={100} style={{ marginRight: '10px' }} />
        <Skeleton height={40} width={100} style={{ marginRight: '10px' }} />
        <Skeleton height={40} width={100} />
      </div>

      {/* Skeleton for shop indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <Skeleton height={20} width={100} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={150} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={120} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={100} style={{ marginBottom: '10px' }} />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <Skeleton height={20} width={100} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={150} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={120} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={100} style={{ marginBottom: '10px' }} />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <Skeleton height={20} width={100} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={150} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={120} style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width={100} style={{ marginBottom: '10px' }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;