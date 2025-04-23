function CheckoutModal({ cartItems, onClose, onConfirm }) {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg sm:max-w-md animate-fade-in" role="dialog" aria-labelledby="checkout-title" tabIndex="-1">
          <h2 id="checkout-title" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Checkout</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">Your cart is empty</p>
          ) : (
            <div className="mt-4">
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
                      <span className="text-sm text-gray-900 dark:text-white">{item.name} (x{item.quantity})</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                Total: ${total.toLocaleString()}
              </p>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
              aria-label="Confirm payment"
              disabled={cartItems.length === 0}
            >
              Confirm Payment
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
              aria-label="Cancel checkout"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default CheckoutModal;