const express = require("express");
const cors = require("cors");

const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;