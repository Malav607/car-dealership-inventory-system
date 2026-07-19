import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBag, ChevronRight, Clock, MapPin, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import Breadcrumbs from "../components/Breadcrumbs";

const API_BASE_URL = "https://car-dealership-inventory-system-hmd3.onrender.com/api";

const MyPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch purchases");
        setOrders(data.data || []);
      } catch (err) {
        toast.error(err.message || "Error loading order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Order Confirmed":
      case "Processing":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Order Confirmed</span>;
      case "Preparing Vehicle":
      case "Confirmed":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">Preparing Vehicle</span>;
      case "In Transit":
      case "Shipped":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">In Transit</span>;
      case "Delivered":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Delivered</span>;
      case "Cancelled":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(0,240,255,0.3)" } }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <Breadcrumbs customCrumbs={[{ label: "My Purchases" }]} />
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-accent">Customer Dashboard</span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Purchases & Orders</h1>
          </div>
          <Link to="/" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold">
            Browse Marketplace
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-3xl skeleton-shimmer border border-slate-800" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl space-y-4 border border-slate-800 max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Vehicles Purchased Yet</h3>
            <p className="text-xs text-slate-400">
              When you purchase a vehicle from Apex Motors, your order history and live delivery tracking map will appear here.
            </p>
            <Link to="/" className="inline-block px-6 py-3 bg-cyan-accent text-obsidian-950 font-bold rounded-xl text-xs shadow-glow">
              Explore Available Vehicles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const carImg = order.carDetails?.image || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80";
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan-accent/40 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={carImg}
                      alt={order.carDetails?.model}
                      className="w-28 h-20 object-cover rounded-2xl border border-slate-700/80"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-cyan-accent">{order.carDetails?.make}</span>
                        <span className="text-xs text-slate-500">• Order #{order._id.slice(-6)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {order.carDetails?.model} ({order.carDetails?.year})
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </span>
                        {order.distanceKm && (
                          <span className="flex items-center gap-1 text-cyan-accent font-semibold">
                            <Truck className="w-3.5 h-3.5 text-cyan-accent" />
                            {order.distanceKm} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Amount</span>
                      <span className="text-xl font-extrabold text-white">${order.totalAmount?.toLocaleString()}</span>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="p-3 bg-cyan-accent/10 hover:bg-cyan-accent/20 border border-cyan-accent/30 text-cyan-accent rounded-2xl transition-colors"
                      title="Track Order & Route"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyPurchases;
