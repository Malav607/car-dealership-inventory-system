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
      country: { type: String, default: "United States", trim: true },
    },
    deliveryCoords: {
      lat: { type: Number, default: 34.0522 },
      lng: { type: Number, default: -118.2437 },
    },
    status: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentMethod: {
      type: String,
      default: "Credit Card (Simulated)",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid",
    },
    estimatedDeliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
