const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminAnalytics,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all order routes
router.use(protect);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/analytics", authorize("Admin"), getAdminAnalytics);
router.get("/", authorize("Admin"), getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", authorize("Admin"), updateOrderStatus);

module.exports = router;
