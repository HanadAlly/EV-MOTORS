function Cart({ cartItems, onRemoveFromCart, onUpdateQuantity, isOpen, toggleCart, onCheckout, onExportPDF }) {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cart</h2>
            <button onClick={toggleCart} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" aria-label="Close cart">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your cart is empty</p>
          ) : (
            <ul className="flex-1 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2 border-b pb-2">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-900 dark:text-white">{item.name}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">${item.price.toLocaleString()} x {item.quantity}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cartItems.length > 0 && (
            <div className="mt-4 space-y-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Total: ${total.toLocaleString()}
              </p>
              <button
                onClick={onExportPDF}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                aria-label="Export cart as PDF"
              >
                Export as PDF
              </button>
              <button
                onClick={onCheckout}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                aria-label="Proceed to checkout"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default Cart;