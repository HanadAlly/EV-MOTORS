function ProductSkeleton() {
    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 animate-pulse">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="mt-3 h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="flex gap-2 mt-4">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  export default ProductSkeleton;