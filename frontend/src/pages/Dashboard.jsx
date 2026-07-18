import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  Car,
  Search,
  SlidersHorizontal,
  DollarSign,
  Tag,
  Settings,
  Fuel,
  Compass,
  Layers,
  ChevronRight,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchCars = async (searchParams = "") => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const url = searchParams
        ? `http://localhost:5000/api/cars/search?${searchParams}`
        : "http://localhost:5000/api/cars";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch inventory");
      }

      setCars(data.data);
    } catch (err) {
      setError(err.message || "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append("make", search); // Search make
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    fetchCars(params.toString());
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    fetchCars();
  };

  const handlePurchase = async (carId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/cars/${carId}/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Purchase failed");
      }

      // Update state directly to reflect decremented quantity
      setCars((prevCars) =>
        prevCars.map((car) => (car._id === carId ? data.data : car))
      );
    } catch (err) {
      alert(err.message || "Purchase failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500/30">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-violet-900/10">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                AutoDeal.
              </span>
              <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Inventory System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Logged in as</p>
              <p className="text-sm font-semibold text-slate-200">{user?.email}</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full uppercase tracking-wider">
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 text-sm font-semibold text-slate-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-10 mb-8">
          <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
              Explore Premium Vehicles
            </h1>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Browse through our premium, verified dealership catalog. Instantly purchase cars or search using precision filters.
            </p>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by make (e.g. Toyota, Honda)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-900 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center space-x-2 px-5 py-3.5 border rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    isFilterOpen
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-violet-950/20"
                >
                  Search
                </button>
                {(search || category || minPrice || maxPrice) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center justify-center p-3.5 border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-2xl transition-all duration-300"
                    title="Reset Filters"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters Drawer */}
            {isFilterOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-900/60 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Sedan, SUV"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Min Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      placeholder="e.g. 10000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Inventory Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <svg className="animate-spin h-8 w-8 text-violet-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide uppercase">Syncing Inventory...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-400 border border-red-900/40 rounded-3xl bg-red-950/10">
            <AlertCircle className="h-10 w-10 mx-auto mb-3" />
            <p className="font-bold mb-1">Could not fetch inventory</p>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 border border-slate-900 rounded-3xl bg-slate-900/10">
            <Car className="h-12 w-12 text-slate-800 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No Vehicles Found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              We couldn't find any vehicles matching your search criteria. Try modifying your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-slate-900/20 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 ease-in-out group shadow-xl shadow-black/10"
              >
                <div>
                  {/* Top Badge Details */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500/20">
                      {car.category || "Vehicle"}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        car.quantity > 0
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-slate-500 bg-slate-800/10 border border-slate-800/20"
                      }`}
                    >
                      {car.quantity > 0 ? "Available" : "Sold"}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-violet-400 transition-colors duration-300">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{car.year} • {car.color}</p>
                    <p className="text-2xl font-black text-white mt-2">
                      ${car.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Specs grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-slate-900/80 text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-slate-600" />
                      <span>{car.mileage?.toLocaleString()} mi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-slate-600" />
                      <span>{car.fuelType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-slate-600" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-slate-600" />
                      <span>Stock: <strong className="text-slate-200">{car.quantity}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handlePurchase(car._id)}
                  disabled={car.quantity <= 0}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 ${
                    car.quantity > 0
                      ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/20 hover:shadow-violet-500/10"
                      : "bg-slate-950 border border-slate-900 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {car.quantity > 0 ? (
                    <>
                      <span>Buy Vehicle</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <span>Out of Stock</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
