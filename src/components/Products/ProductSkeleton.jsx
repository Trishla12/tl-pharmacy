import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
      <div className="skeleton h-64 w-full"></div>
      <div className="p-4">
        <div className="skeleton h-4 w-20 mb-2"></div>
        <div className="skeleton h-5 w-full mb-2"></div>
        <div className="skeleton h-4 w-32 mb-3"></div>
        <div className="skeleton h-4 w-24 mb-4"></div>
        <div className="skeleton h-10 w-full"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;