const express = require("express");
const cors = require("cors");

const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inquiries", inquiryRoutes);

module.exports = app;