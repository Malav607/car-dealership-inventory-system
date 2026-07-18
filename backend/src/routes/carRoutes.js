const express = require("express");
const { createCar, getCars, searchCars, updateCar, deleteCar } = require("../controllers/carController");

const router = express.Router();

router.post("/", createCar);
router.get("/", getCars);
router.get("/search", searchCars);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

module.exports = router;