const express = require("express");
const { createCar, getCars, searchCars } = require("../controllers/carController");

const router = express.Router();

router.post("/", createCar);
router.get("/", getCars);
router.get("/search", searchCars);

module.exports = router;