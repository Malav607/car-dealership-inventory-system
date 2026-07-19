import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Clock, MapPin, Truck, CheckCircle2, Package, ShieldCheck, FileText } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import toast, { Toaster } from "react-hot-toast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_BASE_URL = "http://localhost:5000/api";

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
          <span className="text-sm font-semibold text-cyan-accent uppercase tracking-wider">Loading Order Status...</span>
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
          <h2 className="text-2xl font-bold">Order Not Found</h2>
          <Link to="/my-purchases" className="mt-4 px-6 py-2 bg-cyan-accent text-obsidian-950 font-bold rounded-xl text-xs">
            Return to My Purchases
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = ["Processing", "Confirmed", "Shipped", "Delivered"];
  const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

  const dealershipCoords = order.car?.dealership
    ? [order.car.dealership.lat, order.car.dealership.lng]
    : [34.0671, -118.4005]; // Beverly Hills Flagship

  const deliveryCoords = order.deliveryCoords
    ? [order.deliveryCoords.lat, order.deliveryCoords.lng]
    : [34.0522, -118.2437]; // User Destination

  const routePositions = [dealershipCoords, deliveryCoords];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(0,240,255,0.3)" } }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <Link to="/my-purchases" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Purchases</span>
        </Link>

        {/* ORDER HEADER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase text-cyan-accent">Official Invoice</span>
              <span className="text-xs text-slate-500">• ID: #{order._id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {order.carDetails?.make} {order.carDetails?.model} ({order.carDetails?.year})
            </h1>
            <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Paid</span>
            <div className="text-2xl font-extrabold text-white">${order.totalAmount?.toLocaleString()}</div>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Payment Completed
            </span>
          </div>
        </div>

        {/* STATUS TIMELINE STEPPER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-accent" />
            <span>Fulfillment & Delivery Timeline</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                    isCurrent
                      ? "bg-cyan-accent/10 border-cyan-accent shadow-glow text-cyan-accent"
                      : isCompleted
                      ? "bg-slate-900/80 border-slate-700 text-slate-200"
                      : "bg-slate-950/40 border-slate-800 text-slate-600"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                    isCompleted ? "bg-cyan-accent text-obsidian-950" : "bg-slate-800 text-slate-500"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">{step}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">
                    {isCurrent ? "Active Stage" : isCompleted ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELIVERY ROUTE MAP & ADDRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Column */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-accent" />
                <span>Estimated Home Delivery Route</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-400">En Route via Enclosed Transporter</span>
            </div>

            <div className="h-80 rounded-2xl overflow-hidden border border-slate-700">
              <MapContainer center={dealershipCoords} zoom={10} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={dealershipCoords}>
                  <Popup>
                    <strong>Dispatch Dealership</strong>
                    <p>Beverly Hills Flagship</p>
                  </Popup>
                </Marker>
                <Marker position={deliveryCoords}>
                  <Popup>
                    <strong>Destination Address</strong>
                    <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                  </Popup>
                </Marker>
                <Polyline positions={routePositions} color="#00F0FF" weight={4} dashArray="8, 8" />
              </MapContainer>
            </div>
          </div>

          {/* Address & Payment Info Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Destination Address</h3>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-slate-100">{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                <p>{order.shippingAddress?.country || "United States"}</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payment Breakdown</h3>
              <div className="text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="text-slate-100 font-semibold">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle Base Price:</span>
                  <span className="text-slate-100">${order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Delivery:</span>
                  <span className="text-emerald-400 font-semibold">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-cyan-accent">${order.totalAmount?.toLocaleString()}</span>
                </div>
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
