const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Car Dealership Inventory System API 🚗");
});

module.exports = app;