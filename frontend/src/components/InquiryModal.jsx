import React, { useState } from "react";
import Modal from "./Modal";
import { MessageSquare, PhoneCall, Calendar, Car, Send } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = "https://car-dealership-inventory-system-hmd3.onrender.com/api";

const InquiryModal = ({ isOpen, onClose, car }) => {
  const [inquiryType, setInquiryType] = useState("Test Drive");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast.error("Please fill in all required fields");
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
          carId: car?._id,
          type: inquiryType,
          name,
          email,
          phone,
          preferredDate,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit request");

      toast.success("Request received! Our dealership team will contact you.");
      onClose();
      setName("");
      setPhone("");
      setMessage("");
    } catch (err) {
      toast.error(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={car ? `Inquire: ${car.make} ${car.model}` : "Contact Dealership"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {car && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
            <img src={(car.images && car.images.length > 0) ? car.images[0] : ""} alt="car" className="w-16 h-12 object-cover rounded-lg" />
            <div>
              <span className="font-bold text-white text-sm">{car.make} {car.model}</span>
              <p className="text-cyan-accent">${car.price?.toLocaleString()} • Dealership Inventory</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Request Type</label>
          <select
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="glass-input w-full px-4 py-3 rounded-xl text-sm text-slate-100 cursor-pointer"
          >
            <option value="Test Drive" className="bg-obsidian-950">Book a Test Drive</option>
            <option value="Showroom Visit" className="bg-obsidian-950">Schedule Showroom Visit</option>
            <option value="Callback Request" className="bg-obsidian-950">Request Callback</option>
            <option value="Vehicle Inquiry" className="bg-obsidian-950">Vehicle Pricing Inquiry</option>
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
            placeholder="Phone Number *"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="glass-input px-4 py-3 rounded-xl text-sm"
          />
          <input
            type="date"
            placeholder="Preferred Date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="glass-input px-4 py-3 rounded-xl text-sm text-slate-300"
          />
        </div>

        <textarea
          rows={3}
          placeholder="Detailed Question or preferred time for call/test drive..."
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="glass-input w-full px-4 py-3 rounded-xl text-sm"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-xs text-slate-400">Cancel</button>
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-cyan-accent to-blue-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-glow flex items-center gap-2">
            <Send className="w-4 h-4" />
            {submitting ? "Sending Request..." : "Submit Inquiry"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InquiryModal;
