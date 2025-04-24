import { useState, useEffect, useMemo } from 'react';
import ProductCard from './components/ProductCard.jsx';
import Produimport { useState, useEffect, useMemo } from 'react';
import ProductCard from './components/ProductCard.jsx';
import ProductModal from './components/ProductModal.jsx';
import WishlistModal from './components/WishlistModal.jsx';
import CompareModal from './components/CompareModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import Cart from './components/Cart.jsx';
import Toast from './components/Toast.jsx';
import ProductSkeleton from './components/ProductSkeleton.jsx';
import { jsPDF } from 'jspdf';

const electricVehicles = [
  {
    id: 1,
    name: "Tesla Model S",
    price: 89990,
    image: "https://via.placeholder.com/300x200?text=Model+S",
    range: 405,
    description: "High-performance sedan with dual motors and autopilot.",
    topSpeed: "200 mph",
    rating: 4.8,
    safetyRating: 5.0,
    category: "Sedan",
    dealers: [
      { name: "EcoDrive Tesla Center", location: "San Francisco, CA" },
      { name: "Tesla Urban Hub", location: "Los Angeles, CA" },
    ],
  },
  {
    id: 2,
    name: "Rivian R1T",
    price: 73000,
    image: "https://via.placeholder.com/300x200?text=R1T",
    range: 314,
    description: "Adventure-ready electric truck with off-road capabilities.",
    topSpeed: "125 mph",
    rating: 4.5,
    safetyRating: 4.7,
    category: "Truck",
    dealers: [
      { name: "GreenWheels Rivian", location: "Denver, CO" },
      { name: "Rivian Adventure Store", location: "Seattle, WA" },
    ],
  },
  {
    id: 3,
    name: "Ford Mustang Mach-E",
    price: 42995,
    image: "https://via.placeholder.com/300x200?text=Mach-E",
    range: 247,
    description: "Sporty electric SUV with impressive acceleration.",
    topSpeed: "130 mph",
    rating: 4.2,
    safetyRating: 4.8,
    category: "SUV",
    dealers: [{ name: "Ford Electric Depot", location: "Detroit, MI" }],
  },
  {
    id: 4,
    name: "Lucid Air",
    price: 77400,
    image: "https://via.placeholder.com/300x200?text=Lucid+Air",
    range: 520,
    description: "Luxury sedan with unmatched range and elegance.",
    topSpeed: "168 mph",
    rating: 4.9,
    safetyRating: 4.9,
    category: "Sedan",
    dealers: [
      { name: "Lucid Luxury Motors", location: "Palo Alto, CA" },
      { name: "Elite Lucid Gallery", location: "Miami, FL" },
    ],
  },
];

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlistItems');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [compareItems, setCompareItems] = useState(() => {
    const savedCompare = localStorage.getItem('compareItems');
    return savedCompare ? JSON.parse(savedCompare) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const savedRecent = localStorage.getItem('recentlyViewed');
    return savedRecent ? JSON.parse(savedRecent) : [];
  });
  const [toast, setToast] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState([0, 100000]);
  const [rangeFilter, setRangeFilter] = useState([0, 600]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [safetyRatingFilter, setSafetyRatingFilter] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    setTimeout(() => setIsLoading(false), 1000);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (vehicle) => {
    setIsAddingToCart(vehicle.id);
    const existingItem = cartItems.find((item) => item.id === vehicle.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === vehicle.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...vehicle, quantity: 1 }]);
    }
    showToast(`${vehicle.name} added to cart`);
    setIsAddingToCart(null);
  };

  const removeFromCart = (id) => {
    const item = cartItems.find((item) => item.id === id);
    setCartItems(cartItems.filter((item) => item.id !== id));
    showToast(`${item.name} removed from cart`);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const addToWishlist = (vehicle) => {
    if (wishlistItems.some((item) => item.id === vehicle.id)) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== vehicle.id));
      showToast(`${vehicle.name} removed from wishlist`);
    } else {
      setWishlistItems([...wishlistItems, vehicle]);
      showToast(`${vehicle.name} added to wishlist`);
    }
  };

  const removeFromWishlist = (id) => {
    const item = wishlistItems.find((item) => item.id === id);
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    showToast(`${item.name} removed from wishlist`);
  };

  const addToCompare = (vehicle) => {
    if (compareItems.some((item) => item.id === vehicle.id)) {
      setCompareItems(compareItems.filter((item) => item.id !== vehicle.id));
      showToast(`${vehicle.name} removed from comparison`);
    } else if (compareItems.length < 3) {
      setCompareItems([...compareItems, vehicle]);
      showToast(`${vehicle.name} added to comparison`);
    } else {
      showToast("You can compare up to 3 vehicles");
    }
  };

  const removeFromCompare = (id) => {
    const item = compareItems.find((item) => item.id === id);
    setCompareItems(compareItems.filter((item) => item.id !== id));
    showToast(`${item.name} removed from comparison`);
  };

  const addToRecentlyViewed = (vehicle) => {
    const updatedRecent = [
      vehicle,
      ...recentlyViewed.filter((v) => v.id !== vehicle.id),
    ].slice(0, 3);
    setRecentlyViewed(updatedRecent);
  };

  const exportCartAsPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Cart Summary", 20, 20);
      doc.setFontSize(12);
      let y = 30;
      cartItems.forEach((item) => {
        doc.text(
          `${item.name} (x${item.quantity}): $${(
            item.price * item.quantity
          ).toLocaleString()}`,
          20,
          y
        );
        y += 10;
      });
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      doc.text(`Total: $${total.toLocaleString()}`, 20, y + 10);
      doc.save("cart_summary.pdf");
      showToast("Cart exported as PDF");
    } catch (error) {
      showToast("Error exporting PDF");
      console.error("PDF export failed:", error);
    }
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const confirmCheckout = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    showToast("Payment confirmed! Cart cleared.");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Memoize filtered vehicles to optimize performance
  const filteredVehicles = useMemo(() => {
    return electricVehicles
      .filter((v) => v.price >= priceFilter[0] && v.price <= priceFilter[1])
      .filter((v) => v.range >= rangeFilter[0] && v.range <= rangeFilter[1])
      .filter((v) => v.rating >= ratingFilter)
      .filter((v) => v.safetyRating >= safetyRatingFilter)
      .filter((v) => categoryFilter === "All" || v.category === categoryFilter)
      .filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.dealers.some((dealer) =>
          dealer.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        return 0;
      });
  }, [
    priceFilter,
    rangeFilter,
    ratingFilter,
    safetyRatingFilter,
    categoryFilter,
    searchQuery,
    sortOption,
  ]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <header className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">EV Store</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden text-white hover:text-gray-200"
              aria-label="Toggle filters"
              title="Toggle filters"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1m-4 8H3m10 8H3"
                />
              </svg>
            </button>
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="text-white hover:text-gray-200 relative"
              aria-label="View wishlist"
              title="View wishlist"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="text-white hover:text-gray-200 relative"
              aria-label="View comparison"
              title="View comparison"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
              {compareItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {compareItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="text-white hover:text-gray-200 relative"
              aria-label="Toggle cart"
              title="Toggle cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className="text-white hover:text-gray-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isDarkMode
                      ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-md mx-auto sm:mx-0">
            <input
              type="text"
              placeholder="Search vehicles, descriptions, or dealers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search vehicles, descriptions, or dealers"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div
          className={`mb-4 sm:mb-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-all ${
            isFilterOpen ? "block" : "hidden sm:block"
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Filters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceFilter[1]}
                onChange={(e) => setPriceFilter([0, +e.target.value])}
                className="w-full mt-1"
                aria-label="Filter by price range"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Up to ${priceFilter[1].toLocaleString()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Range (miles)
              </label>
              <input
                type="range"
                min="0"
                max="600"
                value={rangeFilter[1]}
                onChange={(e) => setRangeFilter([0, +e.target.value])}
                className="w-full mt-1"
                aria-label="Filter by range"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Up to {rangeFilter[1]} miles
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Rating
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(+e.target.value)}
                className="w-full mt-1"
                aria-label="Filter by minimum rating"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {ratingFilter.toFixed(1)} stars
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Safety Rating
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={safetyRatingFilter}
                onChange={(e) => setSafetyRatingFilter(+e.target.value)}
                className="w-full mt-1"
                aria-label="Filter by minimum safety rating"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {safetyRatingFilter.toFixed(1)}/5
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by category"
              >
                <option value="All">All</option>
                <option value="Sedan">Sedan</option>
                <option value="Truck">Truck</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort vehicles"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array(4)
                .fill()
                .map((_, i) => <ProductSkeleton key={i} />)
            : paginatedVehicles.map((vehicle) => (
                <ProductCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onAddToCart={addToCart}
                  onViewDetails={(v) => {
                    setSelectedVehicle(v);
                    addToRecentlyViewed(v);
                  }}
                  onAddToWishlist={addToWishlist}
                  onAddToCompare={addToCompare}
                  isInWishlist={() =>
                    wishlistItems.some((item) => item.id === vehicle.id)
                  }
                  isInCompare={() =>
                    compareItems.some((item) => item.id === vehicle.id)
                  }
                  isAdding={isAddingToCart === vehicle.id}
                />
              ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
        {recentlyViewed.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentlyViewed.map((vehicle) => (
                <ProductCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onAddToCart={addToCart}
                  onViewDetails={(v) => {
                    setSelectedVehicle(v);
                    addToRecentlyViewed(v);
                  }}
                  onAddToWishlist={addToWishlist}
                  onAddToCompare={addToCompare}
                  isInWishlist={() =>
                    wishlistItems.some((item) => item.id === vehicle.id)
                  }
                  isInCompare={() =>
                    compareItems.some((item) => item.id === vehicle.id)
                  }
                  isAdding={isAddingToCart === vehicle.id}
                />
              ))}
            </div>
          </div>
        )}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-opacity duration-300 z-50"
            aria-label="Scroll back to top"
            title="Back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </main>
      <Cart
        cartItems={cartItems}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        isOpen={isCartOpen}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        onCheckout={handleCheckout}
        onExportPDF={exportCartAsPDF}
      />
      <ProductModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      <WishlistModal
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={removeFromWishlist}
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      <CompareModal
        compareItems={compareItems}
        onRemoveFromCompare={removeFromCompare}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
      <CheckoutModal
        cartItems={cartItems}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={confirmCheckout}
        isOpen={isCheckoutOpen}
      />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;ctModal from './components/ProductModal.jsx';
import WishlistModal from './components/WishlistModal.jsx';
import CompareModal from './components/CompareModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import Cart from './components/Cart.jsx';
import Toast from './components/Toast.jsx';
import ProductSkeleton from './components/ProductSkeleton.jsx';
import { jsPDF } from 'jspdf';

const electricVehicles = [
  {
    id: 1,
    name: "Tesla Model S",
    price: 89990,
    image: "https://via.placeholder.com/300x200?text=Model+S",
    range: 405,
    description: "High-performance sedan with dual motors and autopilot.",
    topSpeed: "200 mph",
    rating: 4.8,
    safetyRating: 5.0,
    category: "Sedan",
    dealers: [
      { name: "EcoDrive Tesla Center", location: "San Francisco, CA" },
      { name: "Tesla Urban Hub", location: "Los Angeles, CA" },
    ],
  },
  {
    id: 2,
    name: "Rivian R1T",
    price: 73000,
    image: "https://via.placeholder.com/300x200?text=R1T",
    range: 314,
    description: "Adventure-ready electric truck with off-road capabilities.",
    topSpeed: "125 mph",
    rating: 4.5,
    safetyRating: 4.7,
    category: "Truck",
    dealers: [
      { name: "GreenWheels Rivian", location: "Denver, CO" },
      { name: "Rivian Adventure Store", location: "Seattle, WA" },
    ],
  },
  {
    id: 3,
    name: "Ford Mustang Mach-E",
    price: 42995,
    image: "https://via.placeholder.com/300x200?text=Mach-E",
    range: 247,
    description: "Sporty electric SUV with impressive acceleration.",
    topSpeed: "130 mph",
    rating: 4.2,
    safetyRating: 4.8,
    category: "SUV",
    dealers: [{ name: "Ford Electric Depot", location: "Detroit, MI" }],
  },
  {
    id: 4,
    name: "Lucid Air",
    price: 77400,
    image: "https://via.placeholder.com/300x200?text=Lucid+Air",
    range: 520,
    description: "Luxury sedan with unmatched range and elegance.",
    topSpeed: "168 mph",
    rating: 4.9,
    safetyRating: 4.9,
    category: "Sedan",
    dealers: [
      { name: "Lucid Luxury Motors", location: "Palo Alto, CA" },
      { name: "Elite Lucid Gallery", location: "Miami, FL" },
    ],
  },
];

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlistItems');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [compareItems, setCompareItems] = useState(() => {
    const savedCompare = localStorage.getItem('compareItems');
    return savedCompare ? JSON.parse(savedCompare) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const savedRecent = localStorage.getItem('recentlyViewed');
    return savedRecent ? JSON.parse(savedRecent) : [];
  });
  const [toast, setToast] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState([0, 100000]);
  const [rangeFilter, setRangeFilter] = useState([0, 600]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [safetyRatingFilter, setSafetyRatingFilter] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    setTimeout(() => setIsLoading(false), 1000);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (vehicle) => {
    setIsAddingToCart(vehicle.id);
    const existingItem = cartItems.find((item) => item.id === vehicle.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === vehicle.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...vehicle, quantity: 1 }]);
    }
    showToast(`${vehicle.name} added to cart`);
    setIsAddingToCart(null);
  };

  const removeFromCart = (id) => {
    const item = cartItems.find((item) => item.id === id);
    setCartItems(cartItems.filter((item) => item.id !== id));
    showToast(`${item.name} removed from cart`);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const addToWishlist = (vehicle) => {
    if (wishlistItems.some((item) => item.id === vehicle.id)) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== vehicle.id));
      showToast(`${vehicle.name} removed from wishlist`);
    } else {
      setWishlistItems([...wishlistItems, vehicle]);
      showToast(`${vehicle.name} added to wishlist`);
    }
  };

  const removeFromWishlist = (id) => {
    const item = wishlistItems.find((item) => item.id === id);
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    showToast(`${item.name} removed from wishlist`);
  };

  const addToCompare = (vehicle) => {
    if (compareItems.some((item) => item.id === vehicle.id)) {
      setCompareItems(compareItems.filter((item) => item.id !== vehicle.id));
      showToast(`${vehicle.name} removed from comparison`);
    } else if (compareItems.length < 3) {
      setCompareItems([...compareItems, vehicle]);
      showToast(`${vehicle.name} added to comparison`);
    } else {
      showToast("You can compare up to 3 vehicles");
    }
  };

  const removeFromCompare = (id) => {
    const item = compareItems.find((item) => item.id === id);
    setCompareItems(compareItems.filter((item) => item.id !== id));
    showToast(`${item.name} removed from comparison`);
  };

  const addToRecentlyViewed = (vehicle) => {
    const updatedRecent = [
      vehicle,
      ...recentlyViewed.filter((v) => v.id !== vehicle.id),
    ].slice(0, 3);
    setRecentlyViewed(updatedRecent);
  };

  const exportCartAsPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Cart Summary", 20, 20);
      doc.setFontSize(12);
      let y = 30;
      cartItems.forEach((item) => {
        doc.text(
          `${item.name} (x${item.quantity}): $${(
            item.price * item.quantity
          ).toLocaleString()}`,
          20,
          y
        );
        y += 10;
      });
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      doc.text(`Total: $${total.toLocaleString()}`, 20, y + 10);
      doc.save("cart_summary.pdf");
      showToast("Cart exported as PDF");
    } catch (error) {
      showToast("Error exporting PDF");
      console.error("PDF export failed:", error);
    }
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const confirmCheckout = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    showToast("Payment confirmed! Cart cleared.");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Memoize filtered vehicles to optimize performance
  const filteredVehicles = useMemo(() => {
    return electricVehicles
      .filter((v) => v.price >= priceFilter[0] && v.price <= priceFilter[1])
      .filter((v) => v.range >= rangeFilter[0] && v.range <= rangeFilter[1])
      .filter((v) => v.rating >= ratingFilter)
      .filter((v) => v.safetyRating >= safetyRatingFilter)
      .filter((v) => categoryFilter === "All" || v.category === categoryFilter)
      .filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.dealers.some((dealer) =>
          dealer.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        return 0;
      });
  }, [
    priceFilter,
    rangeFilter,
    ratingFilter,
    safetyRatingFilter,
    categoryFilter,
    searchQuery,
    sortOption,
  ]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <header className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">EV Store</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden text-white hover:text-gray-200"
              aria-label="Toggle filters"
              title="Toggle filters"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1m-4 8H3m10 8H3"
                />
              </svg>
            </button>
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="text-white hover:text-gray-200 relative"
              aria-label="View wishlist"
              title="View wishlist"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="text-white hover:text-gray-200 relative"
              aria-label="View comparison"
              title="View comparison"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
              {compareItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {compareItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="text-white hover:text-gray-200 relative"
              aria-label="Toggle cart"
              title="Toggle cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className="text-white hover:text-gray-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isDarkMode
                      ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-md mx-auto sm:mx-0">
            <input
              type="text"
              placeholder="Search vehicles, descriptions, or dealers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search vehicles, descriptions, or dealers"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div
          className={`mb-4 sm:mb-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-all ${
            isFilterOpen ? "block" : "hidden sm:block"
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Filters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceFilter[1]}
                onChange={(e) => setPriceFilter([0, +e.target.value])}
                className="w-full mt-1"
                aria-label="Filter by price range"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Up to ${priceFilter[1].toLocaleString()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Range (miles)
              </label>
              <input
                type="range"
                min="0"
                max="600"
                value={rangeFilter[1]}
                onChange={(e) => setRangeFilter([0, +e.target.value])}
                className="w-full mt-1"
                aria-label="Filter by range"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Up to {rangeFilter[1]} miles
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Rating
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(+e.target.value)}
                className="w-full mt-1"
                aria-label="Filter by minimum rating"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {ratingFilter.toFixed(1)} stars
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Safety Rating
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={safetyRatingFilter}
                onChange={(e) => setSafetyRatingFilter(+e.target.value)}
                className="w-full mt-1"
                aria-label="Filter by minimum safety rating"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {safetyRatingFilter.toFixed(1)}/5
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by category"
              >
                <option value="All">All</option>
                <option value="Sedan">Sedan</option>
                <option value="Truck">Truck</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 mt-1 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort vehicles"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array(4)
                .fill()
                .map((_, i) => <ProductSkeleton key={i} />)
            : paginatedVehicles.map((vehicle) => (
                <ProductCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onAddToCart={addToCart}
                  onViewDetails={(v) => {
                    setSelectedVehicle(v);
                    addToRecentlyViewed(v);
                  }}
                  onAddToWishlist={addToWishlist}
                  onAddToCompare={addToCompare}
                  isInWishlist={() =>
                    wishlistItems.some((item) => item.id === vehicle.id)
                  }
                  isInCompare={() =>
                    compareItems.some((item) => item.id === vehicle.id)
                  }
                  isAdding={isAddingToCart === vehicle.id}
                />
              ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
        {recentlyViewed.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentlyViewed.map((vehicle) => (
                <ProductCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onAddToCart={addToCart}
                  onViewDetails={(v) => {
                    setSelectedVehicle(v);
                    addToRecentlyViewed(v);
                  }}
                  onAddToWishlist={addToWishlist}
                  onAddToCompare={addToCompare}
                  isInWishlist={() =>
                    wishlistItems.some((item) => item.id === vehicle.id)
                  }
                  isInCompare={() =>
                    compareItems.some((item) => item.id === vehicle.id)
                  }
                  isAdding={isAddingToCart === vehicle.id}
                />
              ))}
            </div>
          </div>
        )}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-opacity duration-300 z-50"
            aria-label="Scroll back to top"
            title="Back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </main>
      <Cart
        cartItems={cartItems}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        isOpen={isCartOpen}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        onCheckout={handleCheckout}
        onExportPDF={exportCartAsPDF}
      />
      <ProductModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      <WishlistModal
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={removeFromWishlist}
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      <CompareModal
        compareItems={compareItems}
        onRemoveFromCompare={removeFromCompare}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
      <CheckoutModal
        cartItems={cartItems}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={confirmCheckout}
        isOpen={isCheckoutOpen}
      />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;