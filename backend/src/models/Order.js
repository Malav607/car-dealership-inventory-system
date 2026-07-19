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
      country: { type: String, trim: true },
    },
    deliveryCoords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    distanceKm: {
      type: Number,
    },
    estimatedDeliveryDays: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Order Confirmed", "Preparing Vehicle", "In Transit", "Delivered", "Cancelled", "Processing", "Confirmed", "Shipped"],
      default: "Order Confirmed",
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
