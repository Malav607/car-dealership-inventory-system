const express = require("express");

const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;