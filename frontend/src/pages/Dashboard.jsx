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
  Plus,
  Edit2,
  Trash2,
  PackageCheck,
  X,
  AlertCircle,
  HelpCircle,
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

  // Modal State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [selectedCarForRestock, setSelectedCarForRestock] = useState(null);
  const [restockAmount, setRestockAmount] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Manual",
    color: "",
    category: "",
    quantity: "1",
  });
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchCars = async (searchParams = "") => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const url = searchParams
        ? `http://https://car-dealership-inventory-system-hmd3.onrender.com/api/cars/search?${searchParams}`
        : "http://https://car-dealership-inventory-system-hmd3.onrender.com/api/cars";

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
    if (search) params.append("make", search);
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
      const response = await fetch(`http://https://car-dealership-inventory-system-hmd3.onrender.com/api/cars/${carId}/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Purchase failed");
      }

      setCars((prevCars) =>
        prevCars.map((car) => (car._id === carId ? data.data : car))
      );
    } catch (err) {
      alert(err.message || "Purchase failed");
    }
  };

  // CRUD Handlers
  const openCreateModal = () => {
    setEditingCar(null);
    setFormError("");
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      price: "",
      mileage: "",
      fuelType: "Petrol",
      transmission: "Manual",
      color: "",
      category: "",
      quantity: "1",
    });
    setIsCarModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormError("");
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year?.toString() || "",
      price: car.price?.toString() || "",
      mileage: car.mileage?.toString() || "",
      fuelType: car.fuelType || "Petrol",
      transmission: car.transmission || "Manual",
      color: car.color,
      category: car.category,
      quantity: car.quantity?.toString() || "1",
    });
    setIsCarModalOpen(true);
  };

  const openRestockModal = (car) => {
    setSelectedCarForRestock(car);
    setRestockAmount("1");
    setFormError("");
    setIsRestockModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const url = editingCar
        ? `http://https://car-dealership-inventory-system-hmd3.onrender.com/api/cars/${editingCar._id}`
        : "http://https://car-dealership-inventory-system-hmd3.onrender.com/api/cars";
      const method = editingCar ? "PUT" : "POST";

      const payload = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        quantity: Number(formData.quantity),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      if (editingCar) {
        // Update car list
        setCars((prev) => prev.map((car) => (car._id === editingCar._id ? data.data : car)));
      } else {
        // Add new car to front of list
        setCars((prev) => [data.data, ...prev]);
      }

      setIsCarModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Failed to save vehicle details");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this vehicle from the inventory?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://https://car-dealership-inventory-system-hmd3.onrender.com/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Deletion failed");
      }

      setCars((prev) => prev.filter((car) => car._id !== carId));
    } catch (err) {
      alert(err.message || "Deletion failed");
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://https://car-dealership-inventory-system-hmd3.onrender.com/api/cars/${selectedCarForRestock._id}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: Number(restockAmount) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Restocking failed");
      }

      setCars((prev) => prev.map((car) => (car._id === selectedCarForRestock._id ? data.data : car)));
      setIsRestockModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Failed to restock vehicle");
    } finally {
      setFormSubmitting(false);
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
        {/* Banner with Admin action */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-xl mb-6 md:mb-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
              Explore Premium Vehicles
            </h1>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Browse through our premium, verified dealership catalog. Instantly purchase cars or search using precision filters.
            </p>
          </div>
          {user?.role === "Admin" && (
            <button
              onClick={openCreateModal}
              className="relative z-10 flex items-center space-x-2 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-sm px-6 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-white/5 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              <span>Add Vehicle</span>
            </button>
          )}
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
                  className={`flex items-center space-x-2 px-5 py-3.5 border rounded-2xl text-sm font-semibold transition-all duration-300 ${isFilterOpen
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
                className="bg-slate-900/20 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 ease-in-out group shadow-xl shadow-black/10 relative"
              >
                {/* Admin Management Badges */}
                {user?.role === "Admin" && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                      onClick={() => openEditModal(car)}
                      className="p-2 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl shadow-lg transition-all"
                      title="Edit vehicle details"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openRestockModal(car)}
                      className="p-2 bg-slate-950 border border-slate-855 hover:border-slate-750 text-slate-300 hover:text-white rounded-xl shadow-lg transition-all"
                      title="Restock vehicle inventory"
                    >
                      <PackageCheck className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="p-2 bg-slate-950 border border-slate-850 hover:border-red-900/50 text-slate-400 hover:text-red-400 rounded-xl shadow-lg transition-all"
                      title="Delete vehicle"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div>
                  {/* Top Badge Details */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500/20">
                      {car.category || "Vehicle"}
                    </span>
                    {/* Hide state if hovering on admin actions */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition-all duration-300 ${user?.role === "Admin" ? "group-hover:opacity-0" : ""
                        } ${car.quantity > 0
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
                  className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 ${car.quantity > 0
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

      {/* Car Modal (Create & Edit) */}
      {isCarModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-6 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white">
                {editingCar ? "Edit Vehicle Details" : "Add New Vehicle"}
              </h3>
              <button
                onClick={() => setIsCarModalOpen(false)}
                className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCarSubmit} className="space-y-6 pt-6">
              {formError && (
                <div className="rounded-2xl bg-red-950/30 border border-red-800/50 p-4 flex items-start space-x-3 text-red-400 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Make</label>
                  <input
                    type="text"
                    name="make"
                    required
                    value={formData.make}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. Audi, BMW"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Model</label>
                  <input
                    type="text"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. A4, M3"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Year</label>
                  <input
                    type="number"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. 2024"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. 45000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mileage (miles)</label>
                  <input
                    type="number"
                    name="mileage"
                    required
                    min="0"
                    value={formData.mileage}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. 12000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. Sedan, SUV, Coupe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300 appearance-none"
                  >
                    <option value="Petrol" className="bg-slate-900">Petrol</option>
                    <option value="Diesel" className="bg-slate-900">Diesel</option>
                    <option value="Electric" className="bg-slate-900">Electric</option>
                    <option value="Hybrid" className="bg-slate-900">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300 appearance-none"
                  >
                    <option value="Manual" className="bg-slate-900">Manual</option>
                    <option value="Automatic" className="bg-slate-900">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={formData.color}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. Metallic Black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity in Stock</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCarModalOpen(false)}
                  className="px-5 py-3 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-xl text-sm font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-violet-950/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? "Saving..." : "Save Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                Restock Inventory
              </h3>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 pt-4">
              {formError && (
                <div className="rounded-xl bg-red-950/30 border border-red-800/50 p-3 flex items-start space-x-2 text-red-400 text-xs">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400 mb-2">
                  Increasing stock for: <strong className="text-white">{selectedCarForRestock?.make} {selectedCarForRestock?.model}</strong>
                </p>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Amount to Add
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all duration-300"
                  placeholder="e.g. 10"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-xl text-xs font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-violet-950/20 active:scale-95 disabled:opacity-50"
                >
                  {formSubmitting ? "Restocking..." : "Add to Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
