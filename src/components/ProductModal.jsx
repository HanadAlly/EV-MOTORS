import StarRating from './StarRating.jsx';

function ProductModal({ vehicle, onClose }) {
  if (!vehicle) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg sm:max-w-md animate-fade-in" role="dialog" aria-labelledby="modal-title" tabIndex="-1">
        <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{vehicle.name}</h2>
        <img src={vehicle.image} alt={vehicle.name} className="w-full h-64 object-cover rounded mt-4" loading="lazy" />
        <StarRating rating={vehicle.rating} />
        <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">Price: ${vehicle.price.toLocaleString()}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Range: {vehicle.range} miles</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Top Speed: {vehicle.topSpeed}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Safety Rating: {vehicle.safetyRating.toFixed(1)}/5</p>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{vehicle.description}</p>
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Available at:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
            {vehicle.dealers.map((dealer, i) => (
              <li key={i}>{dealer.name} - {dealer.location}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition text-sm font-medium"
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ProductModal;