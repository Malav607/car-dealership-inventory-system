const express = require("express");

const carRoutes = require("./routes/carRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/cars", carRoutes);

module.exports = app;