import { useState } from 'react';
import StarRating from './StarRating.jsx';

function ProductCard({ vehicle, onAddToCart, onViewDetails, onAddToWishlist, onAddToCompare, isInCompare, isInWishlist, isAdding }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    const shareUrl = `${window.location.origin}/vehicle/${vehicle.id}`;
    await navigator.clipboard.writeText(shareUrl);
    setTimeout(() => setIsSharing(false), 1000);
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 animate-fade-in">
      <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover rounded" loading="lazy" />
      <h3 className="text-base sm:text-lg font-semibold mt-3 text-gray-900 dark:text-white">{vehicle.name}</h3>
      <StarRating rating={vehicle.rating} />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Price: ${vehicle.price.toLocaleString()}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Range: {vehicle.range} miles</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Safety Rating: {vehicle.safetyRating.toFixed(1)}/5</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
        Sold by: {vehicle.dealers[0]?.name || 'N/A'}
      </p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onAddToCart(vehicle)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm font-medium flex items-center justify-center"
          aria-label={`Add ${vehicle.name} to cart`}
          disabled={isAdding}
        >
          {isAdding ? <div className="spinner"></div> : 'Add to Cart'}
        </button>
        <button
          onClick={() => onViewDetails(vehicle)}
          className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium"
          aria-label={`View details for ${vehicle.name}`}
        >
          Details
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onAddToWishlist(vehicle)}
          className={`flex-1 text-sm ${isInWishlist() ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'} hover:text-red-700 transition`}
          aria-label={`${isInWishlist() ? 'Remove' : 'Add'} ${vehicle.name} to wishlist`}
        >
          <svg className="w-5 h-5 inline" fill={isInWishlist() ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button
          onClick={() => onAddToCompare(vehicle)}
          className={`flex-1 text-sm ${isInCompare() ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'} hover:text-blue-700 transition`}
          aria-label={`${isInCompare() ? 'Remove' : 'Add'} ${vehicle.name} to compare`}
          disabled={isInCompare() && !isInCompare(vehicle.id)}
        >
          <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
          aria-label={`Share ${vehicle.name}`}
        >
          {isSharing ? (
            <span>Copied!</span>
          ) : (
            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m2.632 2.684C11.114 13.062 11 13.518 11 14c0 .482.114.938.316 1.342m2.684-2.684C13.114 11.938 13 11.482 13 11c0-.482.114-.938.316-1.342m2.632 2.684C15.886 12.062 15.772 12.518 15.772 13c0 .482.114.938.316 1.342M6.75 4.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm12 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-12 15a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm12 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;