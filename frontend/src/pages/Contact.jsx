import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Building } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000/api";

const Contact = () => {
  const [inquiryType, setInquiryType] = useState("Showroom Visit");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast.error("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: inquiryType,
          name,
          email,
          phone,
          preferredDate,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      toast.success("Thank you! Our Rajkot Concierge team has received your message.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const rajkotCoords = [22.3039, 70.8022];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans"
    >
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(0,240,255,0.3)" } }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/30">
            Showroom Concierge
          </span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Contact Apex Motors Rajkot</h1>
          <p className="text-sm text-slate-400">
            Book a private showroom appointment, request a test drive, or inquire about luxury fleet availability in Gujarat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Send Showroom Inquiry</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Service Request</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
                >
                  <option value="Showroom Visit" className="bg-obsidian-950">Book Private Showroom Visit</option>
                  <option value="Test Drive" className="bg-obsidian-950">Request Test Drive</option>
                  <option value="Callback Request" className="bg-obsidian-950">Request Manager Callback</option>
                  <option value="Vehicle Inquiry" className="bg-obsidian-950">Vehicle Offer / Pricing</option>
                  <option value="General Question" className="bg-obsidian-950">General Question</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Phone Number (+91) *"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-300"
                />
              </div>

              <textarea
                rows={4}
                placeholder="Write your message or requested vehicles..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-cyan-accent to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold rounded-2xl text-xs shadow-glow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Sending Request..." : "Submit Showroom Inquiry"}
              </button>
            </form>
          </div>

          {/* Right Column: Address & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-cyan-accent" />
                <span>Rajkot Flagship Showroom</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
                  <span>150 Feet Ring Road, Near Kalavad Road, Rajkot, Gujarat 360005, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-cyan-accent shrink-0" />
                  <span>+91 (281) 555-APEX</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-accent shrink-0" />
                  <span>rajkot.concierge@apexmotors.com</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400 font-semibold pt-1">
                  <Clock className="w-4 h-4" />
                  <span>Mon - Sun: 9:00 AM - 8:00 PM IST</span>
                </div>
              </div>
            </div>

            <div className="h-64 rounded-3xl overflow-hidden glass-panel border border-slate-800">
              <MapContainer center={rajkotCoords} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={rajkotCoords}>
                  <Popup>
                    <strong>Apex Luxury Motors Flagship</strong>
                    <p>Rajkot, Gujarat</p>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Contact;
