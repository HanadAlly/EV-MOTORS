function Toast({ message, onClose }) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in flex items-center gap-2 z-50">
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200" aria-label="Close toast">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }
  
  export default Toast;