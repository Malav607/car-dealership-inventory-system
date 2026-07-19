import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  Package,
  ShieldCheck,
  Building,
  Navigation,
  Sparkles,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import toast, { Toaster } from "react-hot-toast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_BASE_URL = "https://car-dealership-inventory-system-hmd3.onrender.com/api";

const RAJKOT_FLAGSHIP_DEALERSHIP = {
  name: "Apex Luxury Motors Flagship Showroom",
  address: "150 Feet Ring Road, Near Kalavad Road, Rajkot, Gujarat 360005, India",
  phone: "+91 (281) 555-APEX",
  coords: [22.3039, 70.8022],
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to load order details");
        setOrder(data.data);
      } catch (err) {
        toast.error(err.message || "Could not load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-accent border-t-transparent rounded-full animate-spin shadow-glow" />
          <span className="text-sm font-semibold text-cyan-accent uppercase tracking-wider">Loading Delivery Telemetry...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col text-slate-100">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold">Order Record Not Found</h2>
          <Link to="/my-purchases" className="mt-4 px-6 py-2 bg-cyan-accent text-obsidian-950 font-bold rounded-xl text-xs">
            Return to My Purchases
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Modern Order Life-cycle Statuses
  const steps = ["Order Confirmed", "Preparing Vehicle", "In Transit", "Delivered"];

  // Normalize current step index for backwards compatibility
  let currentStepIndex = steps.indexOf(order.status);
  if (currentStepIndex === -1) {
    if (order.status === "Processing") currentStepIndex = 0;
    else if (order.status === "Confirmed") currentStepIndex = 1;
    else if (order.status === "Shipped") currentStepIndex = 2;
    else currentStepIndex = 0;
  }

  const dealershipCoords = order.car?.dealership?.lat && order.car?.dealership?.lng
    ? [order.car.dealership.lat, order.car.dealership.lng]
    : RAJKOT_FLAGSHIP_DEALERSHIP.coords;

  const deliveryCoords = order.deliveryCoords?.lat && order.deliveryCoords?.lng
    ? [order.deliveryCoords.lat, order.deliveryCoords.lng]
    : null;

  const routePositions = deliveryCoords ? [dealershipCoords, deliveryCoords] : [];
  const distanceKm = typeof order.distanceKm === "number" ? order.distanceKm : null;
  const estimatedDeliveryDays = typeof order.estimatedDeliveryDays === "number" ? order.estimatedDeliveryDays : null;
  const etaDate = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(0,240,255,0.3)" } }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <Link to="/my-purchases" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Purchases</span>
        </Link>

        {/* ORDER SUMMARY BANNER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase text-cyan-accent">Vehicle Delivery Order</span>
              <span className="text-xs text-slate-500">• Order #{order._id.slice(-8)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {order.carDetails?.make} {order.carDetails?.model} ({order.carDetails?.year})
            </h1>
            <p className="text-xs text-slate-400 mt-1">Purchased on {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Payment</span>
            <div className="text-2xl font-extrabold text-white">${order.totalAmount?.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Payment Verified
              </span>
            </div>
          </div>
        </div>

        {/* MODERN TIMELINE STEPPER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-accent" />
                <span>Vehicle Delivery Progress</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Dispatched from Rajkot Showroom</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
              {distanceKm !== null && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Distance</span>
                  <span className="font-bold text-cyan-accent">{distanceKm} km</span>
                </div>
              )}
              {distanceKm !== null && <div className="h-6 w-px bg-slate-800" />}
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Delivery Status</span>
                {order.status === "Delivered" ? (
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Vehicle Delivered
                  </span>
                ) : (
                  <span className="font-bold text-emerald-400">
                    {etaDate ? `${etaDate} ` : ""}
                    {estimatedDeliveryDays ? `(${estimatedDeliveryDays} Day${estimatedDeliveryDays > 1 ? "s" : ""})` : "In Progress"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${isCurrent
                    ? "bg-cyan-accent/10 border-cyan-accent shadow-glow text-cyan-accent"
                    : isCompleted
                      ? "bg-slate-900/80 border-slate-700 text-slate-200"
                      : "bg-slate-950/40 border-slate-800 text-slate-600"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${isCompleted ? "bg-cyan-accent text-obsidian-950" : "bg-slate-800 text-slate-500"
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">{step}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">
                    {isCurrent ? "In Progress" : isCompleted ? "Completed" : "Scheduled"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEAFLET ROUTE MAP & DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-accent" />
                <span>Rajkot to {order.shippingAddress?.city} Delivery Route</span>
              </h3>
              <span className="text-xs font-semibold text-cyan-accent">Live Route Active</span>
            </div>

            <div className="h-96 rounded-2xl overflow-hidden border border-slate-700">
              <MapContainer center={dealershipCoords} zoom={deliveryCoords ? 8 : 12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                  url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                />
                <Marker position={dealershipCoords}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="text-cyan-accent font-bold">Dispatch Dealership</strong>
                      <p>Apex Luxury Motors Flagship</p>
                      <p className="text-[10px] text-slate-400">150 Feet Ring Road, Rajkot, Gujarat</p>
                    </div>
                  </Popup>
                </Marker>
                {deliveryCoords && (
                  <Marker position={deliveryCoords}>
                    <Popup>
                      <div className="p-1 text-xs">
                        <strong className="text-emerald-400 font-bold">Delivery Destination</strong>
                        <p>{order.shippingAddress?.street}</p>
                        <p className="text-[10px] text-slate-400">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                {deliveryCoords && <Polyline positions={routePositions} color="#00F0FF" weight={4} dashArray="8, 8" />}
              </MapContainer>
            </div>
          </div>

          {/* Dealership & Delivery Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-accent" />
                <span>Dispatch Dealership</span>
              </h4>
              <div className="text-xs space-y-1">
                <p className="font-bold text-white text-sm">{RAJKOT_FLAGSHIP_DEALERSHIP.name}</p>
                <p className="text-slate-400">{RAJKOT_FLAGSHIP_DEALERSHIP.address}</p>
                <p className="text-cyan-accent font-semibold pt-1">{RAJKOT_FLAGSHIP_DEALERSHIP.phone}</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-accent" />
                <span>Customer Delivery Address</span>
              </h4>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                {order.shippingAddress?.country && order.shippingAddress.country !== "United States" && (
                  <p>{order.shippingAddress.country}</p>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Logistics Summary</h4>
              {distanceKm !== null && (
                <div className="flex justify-between text-slate-300">
                  <span>Distance from Rajkot:</span>
                  <span className="font-bold text-white">{distanceKm} km</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Carrier Service:</span>
                <span className="font-bold text-white">Enclosed Flatbed Transporter</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Option:</span>
                <span className="font-bold text-emerald-400">Standard Dealer Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;
