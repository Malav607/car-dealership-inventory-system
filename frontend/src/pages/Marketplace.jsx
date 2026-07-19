import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SkeletonCard } from "../components/SkeletonCard";
import Modal from "../components/Modal";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  Gauge,
  Fuel,
  Settings,
  Star,
  CheckCircle2,
  FilterX,
} from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = "https://car-dealership-inventory-system-hmd3.onrender.com/api";

const Marketplace = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewedCars") || "[]");
    setRecentlyViewed(stored);
  }, []);

  // Quick Purchase Modal State
  const [quickBuyCar, setQuickBuyCar] = useState(null);
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("Ahmedabad");
  const [shippingState, setShippingState] = useState("Gujarat");
  const [shippingZip, setShippingZip] = useState("380001");
  const [purchasing, setPurchasing] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (selectedMake) params.append("make", selectedMake);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedFuel) params.append("fuelType", selectedFuel);
      if (selectedTransmission) params.append("transmission", selectedTransmission);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sortOption) params.append("sort", sortOption);

      const response = await fetch(`${API_BASE_URL}/cars?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load vehicles");

      setCars(data.data || []);
    } catch (err) {
      setError(err.message || "Could not connect to vehicle server");
      toast.error(err.message || "Error loading inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [selectedMake, selectedCategory, selectedFuel, selectedTransmission, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedMake("");
    setSelectedCategory("");
    setSelectedFuel("");
    setSelectedTransmission("");
    setSortOption("newest");
    setMinPrice("");
    setMaxPrice("");
    fetchCars();
  };

  const handleQuickBuySubmit = async (e) => {
    e.preventDefault();
    if (!shippingStreet || !shippingCity || !shippingState || !shippingZip) {
      toast.error("Please complete all shipping address fields");
      return;
    }

    setPurchasing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId: quickBuyCar._id,
          shippingAddress: {
            street: shippingStreet,
            city: shippingCity,
            state: shippingState,
            zipCode: shippingZip,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Purchase failed");

      toast.success("Congratulations! Your vehicle order is confirmed.");
      setQuickBuyCar(null);
      fetchCars();
      navigate(`/order-success/${data.data._id}`);
    } catch (err) {
      toast.error(err.message || "Order placement failed");
    } finally {
      setPurchasing(false);
    }
  };

  const makesList = ["Porsche", "Tesla", "BMW", "Audi", "Mercedes-Benz", "Range Rover", "Ferrari", "Lamborghini"];
  const categoriesList = ["Coupe", "Sedan", "SUV", "Convertible", "Hatchback"];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(0,240,255,0.3)" } }} />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80 bg-gradient-to-b from-obsidian-900 via-obsidian-950 to-obsidian-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-glow/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-accent/30 text-cyan-accent text-xs font-semibold tracking-wide uppercase shadow-glow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Automotive Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Drive the Extraordinary. <br />
                <span className="bg-gradient-to-r from-cyan-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Owned in Seconds.
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
                Explore an elite inventory of certified luxury supercars, electric performers, and executive SUVs with transparent specs and instant nationwide delivery.
              </p>

              {/* Quick Search Input */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 p-2 glass-panel rounded-2xl border border-slate-700/80 max-w-xl shadow-2xl">
                <div className="flex items-center gap-2 pl-3 flex-1">
                  <Search className="w-5 h-5 text-cyan-accent shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Porsche, Model S, V8, Coupe..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-accent to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-sm rounded-xl transition-all shadow-glow flex items-center gap-2 shrink-0"
                >
                  <span>Search Fleet</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>

              {/* Key Value Props */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-cyan-accent" />
                  <span className="text-xs text-slate-300 font-medium">100% Verified Stock</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-cyan-accent" />
                  <span className="text-xs text-slate-300 font-medium">Instant Purchase</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-cyan-accent" />
                  <span className="text-xs text-slate-300 font-medium">Apex Warranty</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Showcase Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-700/60 p-2 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                  alt="Porsche 911 GT3 RS"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent rounded-2xl" />

                <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-2xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-cyan-accent uppercase tracking-wider">Featured Flagship</span>
                    <h3 className="text-lg font-bold text-white">Porsche 911 GT3 RS</h3>
                  </div>
                  <span className="text-lg font-extrabold text-white">$241,300</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAIN MARKETPLACE SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        {/* FILTER BAR */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-accent" />
              <h2 className="text-lg font-bold text-white tracking-tight">Vehicle Filters</h2>
            </div>

            {/* Clear filters trigger */}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-cyan-accent flex items-center gap-1.5 transition-colors"
            >
              <FilterX className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Make Select */}
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-obsidian-950">All Makes</option>
              {makesList.map((m) => (
                <option key={m} value={m} className="bg-obsidian-950">{m}</option>
              ))}
            </select>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-obsidian-950">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c} className="bg-obsidian-950">{c}</option>
              ))}
            </select>

            {/* Fuel Type */}
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-obsidian-950">All Powertrains</option>
              <option value="Petrol" className="bg-obsidian-950">Petrol / Gas</option>
              <option value="Electric" className="bg-obsidian-950">Electric (EV)</option>
              <option value="Hybrid" className="bg-obsidian-950">Hybrid / PHEV</option>
              <option value="Diesel" className="bg-obsidian-950">Diesel</option>
            </select>

            {/* Transmission */}
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-obsidian-950">Transmission</option>
              <option value="Automatic" className="bg-obsidian-950">Automatic</option>
              <option value="Manual" className="bg-obsidian-950">Manual</option>
            </select>

            {/* Sorting */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-semibold text-cyan-accent focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-obsidian-950">Sort: Newest Arrival</option>
              <option value="price_asc" className="bg-obsidian-950">Price: Low to High</option>
              <option value="price_desc" className="bg-obsidian-950">Price: High to Low</option>
              <option value="year_desc" className="bg-obsidian-950">Model Year: Newest</option>
            </select>
          </div>
        </div>

        {/* VEHICLE GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : cars.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl space-y-4 border border-slate-800">
            <FilterX className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Vehicles Match Criteria</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Try broadening your filter parameters or search terms to find available vehicles in our inventory.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const coverImg = (car.images && car.images.length > 0)
                ? car.images[0]
                : "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80";

              return (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass-panel rounded-3xl overflow-hidden border border-slate-800/80 glass-panel-hover flex flex-col justify-between group"
                >
                  <div>
                    {/* Vehicle Card Header Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={coverImg}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-80" />

                      {/* Stock Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${car.quantity > 0
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            }`}
                        >
                          {car.quantity > 0 ? `${car.quantity} Available` : "Sold Out"}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold text-slate-300 glass-panel border border-slate-700/60">
                          {car.category}
                        </span>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs font-semibold text-cyan-accent uppercase tracking-wider">{car.make}</span>
                        <h3 className="text-xl font-bold text-white tracking-tight">{car.model}</h3>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/60 text-xs">
                        <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                          <Gauge className="w-4 h-4 text-cyan-accent mb-1" />
                          <span className="text-[10px] text-slate-400">Year</span>
                          <span className="font-semibold text-slate-200">{car.year}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                          <Fuel className="w-4 h-4 text-cyan-accent mb-1" />
                          <span className="text-[10px] text-slate-400">Fuel</span>
                          <span className="font-semibold text-slate-200">{car.fuelType}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                          <Settings className="w-4 h-4 text-cyan-accent mb-1" />
                          <span className="text-[10px] text-slate-400">Gearbox</span>
                          <span className="font-semibold text-slate-200">{car.transmission}</span>
                        </div>
                      </div>

                      {/* Performance Highlights */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Mileage: <strong className="text-slate-200">{car.mileage?.toLocaleString()} mi</strong></span>
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {car.rating || 4.8}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-800/60">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Price</span>
                      <div className="text-xl font-extrabold text-white">${car.price?.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/cars/${car._id}`}
                        className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Details
                      </Link>

                      {car.quantity > 0 && (
                        <button
                          onClick={() => setQuickBuyCar(car)}
                          className="px-4 py-2.5 bg-cyan-accent hover:bg-cyan-400 text-obsidian-950 font-bold rounded-xl text-xs transition-all shadow-glow flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Buy
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* QUICK PURCHASE MODAL */}
      <Modal
        isOpen={!!quickBuyCar}
        onClose={() => setQuickBuyCar(null)}
        title={`Purchase Confirmation: ${quickBuyCar?.make} ${quickBuyCar?.model}`}
      >
        {quickBuyCar && (
          <form onSubmit={handleQuickBuySubmit} className="space-y-6">
            <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl border border-slate-800">
              <img
                src={(quickBuyCar.images && quickBuyCar.images.length > 0) ? quickBuyCar.images[0] : ""}
                alt={quickBuyCar.model}
                className="w-24 h-16 object-cover rounded-xl border border-slate-700"
              />
              <div>
                <span className="text-xs text-cyan-accent font-semibold uppercase">{quickBuyCar.make}</span>
                <h4 className="text-lg font-bold text-white">{quickBuyCar.model} ({quickBuyCar.year})</h4>
                <p className="text-sm font-extrabold text-emerald-400">${quickBuyCar.price?.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Delivery Address</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-500 col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-500"
                />
                <input
                  type="text"
                  placeholder="State / Province"
                  required
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-500"
                />
                <input
                  type="text"
                  placeholder="Postal Zip Code"
                  required
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-500 col-span-2"
                />
              </div>
            </div>

            {/* Order Price Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Vehicle Price:</span>
                <span>${quickBuyCar.price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Home Delivery & Logistics:</span>
                <span className="text-emerald-400 font-semibold">Complimentary</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Total Due:</span>
                <span className="text-cyan-accent">${quickBuyCar.price?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuickBuyCar(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={purchasing}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-accent to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold rounded-xl text-xs shadow-glow flex items-center gap-2"
              >
                {purchasing ? "Confirming Order..." : "Confirm & Pay"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default Marketplace;
