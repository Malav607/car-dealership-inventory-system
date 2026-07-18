const express = require("express");
const { createCar, getCars, searchCars, updateCar, deleteCar } = require("../controllers/carController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

router.post("/", createCar);
router.get("/", getCars);
router.get("/search", searchCars);
router.put("/:id", updateCar);
router.delete("/:id", authorize("Admin"), deleteCar);

module.exports = router;