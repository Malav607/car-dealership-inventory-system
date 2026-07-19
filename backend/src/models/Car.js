const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Manual", "Automatic"],
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    status: {
      type: String,
      enum: ["Available", "Sold"],
      default: "Available",
    },
    images: {
      type: [String],
      default: [
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
      ],
    },
    description: {
      type: String,
      trim: true,
      default: "High-performance luxury vehicle featuring premium crafting, cutting-edge technology, and exceptional handling.",
    },
    specs: {
      engine: { type: String, default: "3.0L Turbocharged V6" },
      horsepower: { type: Number, default: 375 },
      acceleration: { type: String, default: "4.2s 0-60mph" },
      topSpeed: { type: String, default: "175 mph" },
      seating: { type: Number, default: 5 },
      drivetrain: { type: String, default: "AWD" },
    },
    features: {
      type: [String],
      default: [
        "Adaptive Cruise Control",
        "Panoram Sunroof",
        "Ventilated Leather Seats",
        "Burmester 3D Surround Sound",
        "Lane Keep Assist",
        "Heads-Up Display",
      ],
    },
    dealership: {
      name: { type: String, default: "Apex Luxury Motors Flagship Showroom" },
      address: { type: String, default: "150 Feet Ring Road, Near Kalavad Road, Rajkot, Gujarat 360005, India" },
      phone: { type: String, default: "+91 (281) 555-APEX" },
      lat: { type: Number, default: 22.3039 },
      lng: { type: Number, default: 70.8022 },
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 18,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);