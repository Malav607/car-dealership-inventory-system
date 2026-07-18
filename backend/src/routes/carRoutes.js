const express = require("express");
const { createCar, getCars, searchCars, updateCar } = require("../controllers/carController");

const router = express.Router();

router.post("/", createCar);
router.get("/", getCars);
router.get("/search", searchCars);
router.put("/:id", updateCar);

module.exports = router;