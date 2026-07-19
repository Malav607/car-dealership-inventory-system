import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, Sparkles, Truck, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = "https://car-dealership-inventory-system-hmd3.onrender.com/api";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setOrder(data.data);
      } catch (err) {
        console.error("Order fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans relative overflow-hidden"
    >
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8 z-10 my-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-accent/40 text-center space-y-6 shadow-glow relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-cyan-accent/20 border-2 border-cyan-accent flex items-center justify-center mx-auto text-cyan-accent shadow-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Purchase Completed</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Congratulations On Your New Vehicle!</h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Your order has been confirmed by Apex Motors Rajkot Dealership.
            </p>
          </div>

          {order && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Order Reference</span>
                  <p className="font-extrabold text-white text-sm">#{order._id}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Total Amount Paid</span>
                  <p className="font-extrabold text-cyan-accent text-sm">${order.totalAmount?.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {order.carDetails?.image && (
                  <img src={order.carDetails.image} alt="car" className="w-20 h-14 object-cover rounded-xl border border-slate-800" />
                )}
                <div>
                  <h4 className="font-bold text-white">{order.carDetails?.make} {order.carDetails?.model} ({order.carDetails?.year})</h4>
                  <p className="text-xs text-slate-400">Dispatch Location: Rajkot, Gujarat</p>
                  {order.estimatedDeliveryDays || order.distanceKm ? (
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                      {order.estimatedDeliveryDays ? `Estimated Delivery: ${order.estimatedDeliveryDays} Day${order.estimatedDeliveryDays > 1 ? "s" : ""}` : ""}
                      {order.distanceKm ? ` (${order.distanceKm} km)` : ""}
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                      Status: {order.status}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={`/orders/${orderId}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-accent to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold rounded-2xl text-xs shadow-glow flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Route</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/my-purchases"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-2xl text-xs border border-slate-800"
            >
              View My Purchases
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default OrderSuccess;
