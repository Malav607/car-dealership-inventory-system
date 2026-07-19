const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    carDetails: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, default: "" },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      country: { type: String, default: "India", trim: true },
    },
    deliveryCoords: {
      lat: { type: Number, default: 23.0225 },
      lng: { type: Number, default: 72.5714 },
    },
    distanceKm: {
      type: Number,
      default: 215,
    },
    estimatedDeliveryDays: {
      type: Number,
      default: 2,
    },
    status: {
      type: String,
      enum: ["Order Confirmed", "Preparing Vehicle", "In Transit", "Delivered", "Cancelled", "Processing", "Confirmed", "Shipped"],
      default: "Order Confirmed",
    },
    paymentMethod: {
      type: String,
      default: "Razorpay / Credit Card (Simulated)",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid",
    },
    estimatedDeliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
