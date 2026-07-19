const express = require("express");
const { createCar, getCars, getCarById, searchCars, updateCar, deleteCar, purchaseCar, restockCar } = require("../controllers/carController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

router.post("/", createCar);
router.get("/", getCars);
router.get("/search", searchCars);
router.get("/:id", getCarById);
router.put("/:id", updateCar);
router.delete("/:id", authorize("Admin"), deleteCar);
router.post("/:id/purchase", purchaseCar);
router.patch("/:id/restock", authorize("Admin"), restockCar);

module.exports = router;