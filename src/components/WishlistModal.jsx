function WishlistModal({ wishlistItems, onRemoveFromWishlist, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg sm:max-w-md animate-fade-in" role="dialog" aria-labelledby="wishlist-title" tabIndex="-1">
          <h2 id="wishlist-title" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Wishlist</h2>
          {wishlistItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">Your wishlist is empty</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {wishlistItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
                    <span className="text-sm text-gray-900 dark:text-white">{item.name}</span>
                  </div>
                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={onClose}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition text-sm font-medium"
            aria-label="Close wishlist"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  export default WishlistModal;