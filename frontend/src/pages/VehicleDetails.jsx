import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import {
  ArrowLeft,
  Star,
  Zap,
  MapPin,
  Phone,
  Gauge,
  Fuel,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// Fix Leaflet marker icon URLs in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_BASE_URL = "http://localhost:5000/api";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Purchase Modal State
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to load vehicle");
        setCar(data.data);
      } catch (err) {
        toast.error(err.message || "Could not load vehicle details");
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id]);

  const handlePurchaseSubmit = async (e) => {
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
          carId: car._id,
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

      toast.success("Order confirmed successfully!");
      setIsPurchaseModalOpen(false);
      navigate(`/orders/${data.data._id}`);
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-accent border-t-transparent rounded-full animate-spin shadow-glow" />
          <span className="text-sm font-semibold text-cyan-accent uppercase tracking-wider">Loading Vehicle Details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col text-slate-100">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold">Vehicle Not Found</h2>
          <p className="text-slate-400 mt-2">The requested car may have been removed or sold.</p>
          <Link to="/" className="mt-6 px-6 py-2.5 bg-cyan-accent text-obsidian-950 font-bold rounded-xl text-xs">
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = (car.images && car.images.length > 0)
    ? car.images
    : ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"];

  const dealership = car.dealership || {
    name: "Apex Beverly Hills Luxury",
    address: "9500 Wilshire Blvd, Beverly Hills, CA 90212",
    phone: "+1 (310) 555-9110",
    lat: 34.0671,
    lng: -118.4005,
  };

  const specs = car.specs || {
    engine: "3.0L Turbocharged V6",
    horsepower: 375,
    acceleration: "4.2s 0-60mph",
    topSpeed: "175 mph",
    seating: 5,
    drivetrain: "AWD",
  };

  const features = car.features || [
    "Adaptive Cruise Control",
    "Panoramic Sunroof",
    "Ventilated Nappa Leather",
    "Burmester 3D Surround Sound",
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(0,240,255,0.3)" } }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-10">
        {/* Back navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {/* TOP VEHICLE HEADER & GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Showcase Image */}
            <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden glass-panel border border-slate-700/80 group">
              <img
                src={images[activeImageIndex]}
                alt={car.model}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                onClick={() => setIsLightboxOpen(true)}
              />
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 p-3 rounded-2xl glass-panel text-white hover:text-cyan-accent transition-colors"
                title="Expand Gallery"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-obsidian-950/80 text-cyan-accent border border-cyan-accent/30 backdrop-blur-md">
                  {activeImageIndex + 1} / {images.length} Photos
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? "border-cyan-accent shadow-glow scale-105" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-6 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/30">
                  {car.category}
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {car.rating || 4.8} ({car.reviewsCount || 18} Reviews)
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {car.make} {car.model}
              </h1>
              <p className="text-xs text-slate-400 mt-1">Model Year: {car.year} • Stock ID: #{car._id.slice(-6)}</p>
            </div>

            {/* Pricing Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-obsidian-900 to-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Purchase Price</span>
                <div className="text-3xl font-extrabold text-white">${car.price?.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold uppercase ${car.quantity > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {car.quantity > 0 ? `In Stock (${car.quantity})` : "Sold Out"}
                </span>
                <p className="text-[10px] text-slate-400">Home Delivery Available</p>
              </div>
            </div>

            {/* Key Quick Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Engine / Power</span>
                <p className="font-semibold text-slate-100 mt-0.5">{specs.engine}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Horsepower</span>
                <p className="font-semibold text-cyan-accent mt-0.5">{specs.horsepower} HP</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">0 - 60 mph</span>
                <p className="font-semibold text-slate-100 mt-0.5">{specs.acceleration}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Top Speed</span>
                <p className="font-semibold text-slate-100 mt-0.5">{specs.topSpeed}</p>
              </div>
            </div>

            {/* Purchase CTA */}
            {car.quantity > 0 ? (
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-cyan-accent to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-sm rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                Proceed to Buy Vehicle
              </button>
            ) : (
              <div className="w-full py-4 bg-rose-500/20 text-rose-400 text-center rounded-2xl font-bold text-sm border border-rose-500/30">
                Vehicle Currently Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* FULL SPECS & FEATURES TABS / SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Description & Specifications */}
          <div className="lg:col-span-7 space-y-8">
            {/* Overview */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-white">Vehicle Overview</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {car.description || "The epitome of high-performance luxury automotive engineering. Equipped with state-of-the-art dynamics, active driver aids, and a hand-tailored cabin."}
              </p>
            </div>

            {/* Features Checklist */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-accent" />
                <span>Premium Equipment & Options</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-accent shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dealership Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-accent" />
                <span>Dealership Showroom Location</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="font-bold text-slate-100 text-sm">{dealership.name}</p>
                <p className="text-slate-400">{dealership.address}</p>
                <p className="flex items-center gap-2 text-cyan-accent">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{dealership.phone}</span>
                </p>
              </div>

              {/* Interactive Leaflet Map */}
              <div className="h-64 rounded-2xl overflow-hidden border border-slate-700">
                <MapContainer center={[dealership.lat, dealership.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[dealership.lat, dealership.lng]}>
                    <Popup>
                      <div className="p-1 text-xs">
                        <strong>{dealership.name}</strong>
                        <p>{dealership.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* LIGHTBOX MODAL */}
      <Modal isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} title={`${car.make} ${car.model} Gallery`} maxWidth="max-w-5xl">
        <div className="space-y-4">
          <img src={images[activeImageIndex]} alt="full view" className="w-full max-h-[70vh] object-contain rounded-2xl" />
          <div className="flex gap-2 overflow-x-auto justify-center pb-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-14 object-cover rounded-xl cursor-pointer border-2 ${activeImageIndex === idx ? "border-cyan-accent" : "border-transparent"}`}
              />
            ))}
          </div>
        </div>
      </Modal>

      {/* PURCHASE CONFIRMATION MODAL */}
      <Modal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} title={`Complete Order: ${car.make} ${car.model}`}>
        <form onSubmit={handlePurchaseSubmit} className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-cyan-accent font-semibold">{car.make}</span>
              <h4 className="text-lg font-bold text-white">{car.model}</h4>
            </div>
            <span className="text-xl font-extrabold text-emerald-400">${car.price?.toLocaleString()}</span>
          </div>

          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Shipping & Delivery Destination</h5>
            <input
              type="text"
              placeholder="Street Address"
              required
              value={shippingStreet}
              onChange={(e) => setShippingStreet(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm text-slate-100"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                required
                value={shippingCity}
                onChange={(e) => setShippingCity(e.target.value)}
                className="glass-input px-4 py-3 rounded-xl text-sm text-slate-100"
              />
              <input
                type="text"
                placeholder="State"
                required
                value={shippingState}
                onChange={(e) => setShippingState(e.target.value)}
                className="glass-input px-4 py-3 rounded-xl text-sm text-slate-100"
              />
            </div>
            <input
              type="text"
              placeholder="Postal Zip Code"
              required
              value={shippingZip}
              onChange={(e) => setShippingZip(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsPurchaseModalOpen(false)} className="px-5 py-2.5 text-xs text-slate-400">Cancel</button>
            <button type="submit" disabled={purchasing} className="px-6 py-2.5 bg-cyan-accent text-obsidian-950 font-bold rounded-xl text-xs shadow-glow">
              {purchasing ? "Processing..." : "Place Vehicle Order"}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default VehicleDetails;
