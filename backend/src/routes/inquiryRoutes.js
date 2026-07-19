const express = require("express");
const {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiryController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createInquiry);
router.get("/my-inquiries", getMyInquiries);
router.get("/", authorize("Admin"), getAllInquiries);
router.patch("/:id/status", authorize("Admin"), updateInquiryStatus);

module.exports = router;
