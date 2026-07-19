import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import BrandImagePickerModal from "../components/BrandImagePickerModal";
import {
  ShieldCheck,
  DollarSign,
  ShoppingBag,
  Car,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  RefreshCw,
  Search,
  CheckCircle2,
  PackageCheck,
  BarChart3,
  Image as ImageIcon,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics"); // analytics | inventory | orders | inquiries

  // Vehicle Modal (Add/Edit)
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carFormData, setCarFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "",
    category: "Coupe",
    quantity: "1",
    imageUrl: "",
  });

  // Restock Modal
  const [restockCar, setRestockCar] = useState(null);
  const [restockQty, setRestockQty] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Analytics
      const analyticsRes = await fetch(`${API_BASE_URL}/orders/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const analyticsData = await analyticsRes.json();
      if (analyticsRes.ok) setAnalytics(analyticsData.data);

      // Full Inventory
      const inventoryRes = await fetch(`${API_BASE_URL}/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const inventoryData = await inventoryRes.json();
      if (inventoryRes.ok) setInventory(inventoryData.data || []);

      // Orders List
      const ordersRes = await fetch(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      if (ordersRes.ok) setOrders(ordersData.data || []);

      // Customer Inquiries
      const inquiriesRes = await fetch(`${API_BASE_URL}/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const inquiriesData = await inquiriesRes.json();
      if (inquiriesRes.ok) setInquiries(inquiriesData.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load admin telemetry");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update inquiry");
      toast.success(`Inquiry status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCar(null);
    setCarFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: "",
      mileage: "",
      fuelType: "Petrol",
      transmission: "Automatic",
      color: "",
      category: "Coupe",
      quantity: "1",
      imageUrl: "",
    });
    setIsCarModalOpen(true);
  };

  const handleOpenEditModal = (car) => {
    setEditingCar(car);
    setCarFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuelType: car.fuelType,
      transmission: car.transmission,
      color: car.color,
      category: car.category,
      quantity: car.quantity,
      imageUrl: (car.images && car.images.length > 0) ? car.images[0] : "",
    });
    setIsCarModalOpen(true);
  };

  const handleSaveCarSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = editingCar ? "PUT" : "POST";
      const url = editingCar ? `${API_BASE_URL}/cars/${editingCar._id}` : `${API_BASE_URL}/cars`;

      const payload = {
        ...carFormData,
        year: Number(carFormData.year),
        price: Number(carFormData.price),
        mileage: Number(carFormData.mileage),
        quantity: Number(carFormData.quantity),
        images: carFormData.imageUrl ? [carFormData.imageUrl] : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save vehicle");

      toast.success(editingCar ? "Vehicle details updated!" : "New vehicle added to fleet!");
      setIsCarModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle from inventory?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/cars/${carId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Deletion failed");
      toast.success("Vehicle deleted cleanly.");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Could not delete vehicle");
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockQty || Number(restockQty) <= 0) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/cars/${restockCar._id}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: Number(restockQty) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Restock failed");
      toast.success(`Restocked ${restockCar.make} ${restockCar.model} with +${restockQty} units.`);
      setRestockCar(null);
      setRestockQty("");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Restock failed");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Status update failed");
      toast.success(`Order status set to ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Could not update order status");
    }
  };

  // Chart data formatting
  const chartData = analytics?.categoryStats
    ? Object.keys(analytics.categoryStats).map((cat) => ({
        category: cat,
        valuation: analytics.categoryStats[cat].totalValuation,
        count: analytics.categoryStats[cat].count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(0,240,255,0.3)" } }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* HEADER & NAVIGATION TABS */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Executive Control Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Telemetry & Fleet Manager</h1>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "analytics" ? "bg-purple-600 text-white shadow-glow" : "text-slate-400 hover:text-white"
              }`}
            >
              Analytics KPI
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "inventory" ? "bg-purple-600 text-white shadow-glow" : "text-slate-400 hover:text-white"
              }`}
            >
              Inventory Fleet ({inventory.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "orders" ? "bg-purple-600 text-white shadow-glow" : "text-slate-400 hover:text-white"
              }`}
            >
              Customer Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "inquiries" ? "bg-purple-600 text-white shadow-glow" : "text-slate-400 hover:text-white"
              }`}
            >
              Inquiries ({inquiries.length})
            </button>
          </div>
        </div>

        {/* TAB 1: ANALYTICS TELEMETRY */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* KPI STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Total Gross Sales</span>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">${analytics?.totalRevenue?.toLocaleString() || 0}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last period</span>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Vehicle Orders</span>
                  <ShoppingBag className="w-5 h-5 text-cyan-accent" />
                </div>
                <div className="text-3xl font-extrabold text-white">{analytics?.totalOrders || 0}</div>
                <span className="text-[10px] text-slate-400 font-semibold">Active customer purchases</span>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Fleet Valuation</span>
                  <Car className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">${analytics?.inventoryValuation?.toLocaleString() || 0}</div>
                <span className="text-[10px] text-slate-400 font-semibold">{analytics?.totalVehicles || 0} cars in dealership</span>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Low Stock Alerts</span>
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-3xl font-extrabold text-rose-400">{analytics?.lowStockCount || 0}</div>
                <span className="text-[10px] text-rose-300 font-semibold">Requires restock attention</span>
              </div>
            </div>

            {/* CHARTS & LOW STOCK LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Category Valuation Chart */}
              <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-accent" />
                  <span>Category Inventory Valuation ($)</span>
                </h3>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="category" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ background: "#0F172A", borderColor: "rgba(0,240,255,0.3)", borderRadius: "12px", color: "#F8FAFC" }}
                        formatter={(val) => [`$${val.toLocaleString()}`, "Valuation"]}
                      />
                      <Bar dataKey="valuation" radius={[8, 8, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#00F0FF" : "#8B5CF6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Low Stock Panel */}
              <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Restock Priority</span>
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                  {analytics?.lowStockCars?.length === 0 ? (
                    <p className="text-xs text-slate-400">All vehicles are well-stocked.</p>
                  ) : (
                    analytics?.lowStockCars?.map((c) => (
                      <div key={c._id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white">{c.make} {c.model}</span>
                          <span className="block text-[10px] text-rose-400 font-semibold">{c.quantity} Left in Stock</span>
                        </div>
                        <button
                          onClick={() => setRestockCar(c)}
                          className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-[10px] font-bold hover:bg-rose-500/30"
                        >
                          Restock
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT TABLE */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Dealership Fleet Inventory</h3>
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-cyan-accent text-obsidian-950 font-bold rounded-xl text-xs shadow-glow flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Add New Vehicle
              </button>
            </div>

            <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Year / Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Fuel / Transmission</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {inventory.map((car) => (
                    <tr key={car._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={(car.images && car.images.length > 0) ? car.images[0] : ""}
                          alt={car.model}
                          className="w-12 h-10 object-cover rounded-lg border border-slate-800"
                        />
                        <div>
                          <span className="font-bold text-white">{car.make} {car.model}</span>
                          <span className="block text-[10px] text-slate-400">{car.color}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {car.year} • <span className="text-cyan-accent font-semibold">{car.category}</span>
                      </td>
                      <td className="p-4 font-bold text-white">${car.price?.toLocaleString()}</td>
                      <td className="p-4 text-slate-300">{car.fuelType} • {car.transmission}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          car.quantity > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        }`}>
                          {car.quantity} Units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRestockCar(car)}
                            className="p-2 text-cyan-accent hover:bg-cyan-accent/10 rounded-lg"
                            title="Quick Restock"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(car)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car._id)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS FULFILLMENT MANAGER */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Customer Order Fulfillment</h3>

            <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Vehicle Purchased</th>
                    <th className="p-4">Total Price</th>
                    <th className="p-4">Fulfillment Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-mono text-cyan-accent">#{ord._id.slice(-6)}</td>
                      <td className="p-4 text-slate-200">{ord.user?.email || "Customer"}</td>
                      <td className="p-4 font-bold text-white">{ord.carDetails?.make} {ord.carDetails?.model}</td>
                      <td className="p-4 font-extrabold text-white">${ord.totalAmount?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === "Delivered" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="glass-input px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
                        >
                          <option value="Processing" className="bg-obsidian-950">Processing</option>
                          <option value="Confirmed" className="bg-obsidian-950">Confirmed</option>
                          <option value="Shipped" className="bg-obsidian-950">Shipped</option>
                          <option value="Delivered" className="bg-obsidian-950">Delivered</option>
                          <option value="Cancelled" className="bg-obsidian-950">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER INQUIRIES & TEST DRIVE REQUESTS */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Customer Inquiries & Test Drive Requests</h3>

            <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4">Customer Contact</th>
                    <th className="p-4">Request Type</th>
                    <th className="p-4">Vehicle Interest</th>
                    <th className="p-4">Message / Preferred Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No customer inquiries recorded yet.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-white block">{inq.name}</span>
                          <span className="text-[10px] text-slate-400">{inq.email} • {inq.phone}</span>
                        </td>
                        <td className="p-4 font-semibold text-cyan-accent">{inq.type}</td>
                        <td className="p-4 text-slate-200">
                          {inq.carDetails ? `${inq.carDetails.make} ${inq.carDetails.model}` : "General Showroom"}
                        </td>
                        <td className="p-4 text-slate-300 max-w-xs truncate">
                          {inq.message}
                          {inq.preferredDate && (
                            <span className="block text-[10px] text-purple-400 font-semibold mt-0.5">
                              Date: {new Date(inq.preferredDate).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inq.status === "Resolved"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : inq.status === "In Progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                            className="glass-input px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
                          >
                            <option value="Pending" className="bg-obsidian-950">Pending</option>
                            <option value="In Progress" className="bg-obsidian-950">In Progress</option>
                            <option value="Resolved" className="bg-obsidian-950">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ADD / EDIT CAR MODAL */}
      <Modal isOpen={isCarModalOpen} onClose={() => setIsCarModalOpen(false)} title={editingCar ? "Edit Vehicle Details" : "Add New Vehicle to Inventory"}>
        <form onSubmit={handleSaveCarSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Make (e.g. Porsche)"
              required
              value={carFormData.make}
              onChange={(e) => setCarFormData({ ...carFormData, make: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
            <input
              type="text"
              placeholder="Model (e.g. 911 GT3)"
              required
              value={carFormData.model}
              onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Year"
              required
              value={carFormData.year}
              onChange={(e) => setCarFormData({ ...carFormData, year: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
            <input
              type="number"
              placeholder="Price ($)"
              required
              value={carFormData.price}
              onChange={(e) => setCarFormData({ ...carFormData, price: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
            <input
              type="number"
              placeholder="Mileage"
              required
              value={carFormData.mileage}
              onChange={(e) => setCarFormData({ ...carFormData, mileage: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <select
              value={carFormData.fuelType}
              onChange={(e) => setCarFormData({ ...carFormData, fuelType: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm cursor-pointer"
            >
              <option value="Petrol" className="bg-obsidian-950">Petrol</option>
              <option value="Electric" className="bg-obsidian-950">Electric</option>
              <option value="Hybrid" className="bg-obsidian-950">Hybrid</option>
              <option value="Diesel" className="bg-obsidian-950">Diesel</option>
            </select>

            <select
              value={carFormData.transmission}
              onChange={(e) => setCarFormData({ ...carFormData, transmission: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm cursor-pointer"
            >
              <option value="Automatic" className="bg-obsidian-950">Automatic</option>
              <option value="Manual" className="bg-obsidian-950">Manual</option>
            </select>

            <input
              type="text"
              placeholder="Color"
              required
              value={carFormData.color}
              onChange={(e) => setCarFormData({ ...carFormData, color: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Category (Coupe, SUV...)"
              required
              value={carFormData.category}
              onChange={(e) => setCarFormData({ ...carFormData, category: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              required
              value={carFormData.quantity}
              onChange={(e) => setCarFormData({ ...carFormData, quantity: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Image URL (Unsplash or local path)"
              value={carFormData.imageUrl}
              onChange={(e) => setCarFormData({ ...carFormData, imageUrl: e.target.value })}
              className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"
            />
            <button
              type="button"
              onClick={() => setIsImagePickerOpen(true)}
              className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-accent font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 shrink-0"
              title="Pick preset image from 15 brand asset collection"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Asset Library</span>
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsCarModalOpen(false)} className="px-5 py-2.5 text-xs text-slate-400">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-glow">
              {editingCar ? "Save Changes" : "Create Vehicle"}
            </button>
          </div>
        </form>
      </Modal>

      {/* BRAND IMAGE PICKER MODAL */}
      <BrandImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        selectedBrand={carFormData.make}
        onSelectImage={(url) => setCarFormData({ ...carFormData, imageUrl: url })}
      />

      {/* RESTOCK MODAL */}
      <Modal isOpen={!!restockCar} onClose={() => setRestockCar(null)} title={`Restock Vehicle: ${restockCar?.make} ${restockCar?.model}`}>
        <form onSubmit={handleRestockSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">Specify additional units to add to current stock ({restockCar?.quantity || 0} currently available).</p>
          <input
            type="number"
            min="1"
            required
            placeholder="Quantity to add (e.g. 5)"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            className="glass-input w-full px-4 py-3 rounded-xl text-sm"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setRestockCar(null)} className="px-5 py-2.5 text-xs text-slate-400">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-cyan-accent text-obsidian-950 font-bold rounded-xl text-xs shadow-glow">
              Confirm Restock
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
