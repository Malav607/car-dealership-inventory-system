const express = require("express");
const { createCar, getCars, searchCars, updateCar, deleteCar, purchaseCar, restockCar } = require("../controllers/carController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

router.post("/", createCar);
router.get("/", getCars);
router.get("/search", searchCars);
router.put("/:id", updateCar);
router.delete("/:id", authorize("Admin"), deleteCar);
router.post("/:id/purchase", purchaseCar);
router.post("/:id/restock", authorize("Admin"), restockCar);

module.exports = router;