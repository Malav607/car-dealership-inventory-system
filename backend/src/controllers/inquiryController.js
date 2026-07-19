const Inquiry = require("../models/Inquiry");
const Car = require("../models/Car");

// Create customer inquiry / test drive booking
const createInquiry = async (req, res) => {
  try {
    const { carId, type, name, email, phone, preferredDate, message } = req.body;
    const userId = req.user._id || req.user.id;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required contact fields (name, email, phone, message)",
      });
    }

    let carDetails = undefined;
    if (carId) {
      const car = await Car.findById(carId);
      if (car) {
        carDetails = {
          make: car.make,
          model: car.model,
          year: car.year,
        };
      }
    }

    const inquiry = await Inquiry.create({
      user: userId,
      car: carId || null,
      carDetails,
      type: type || "Vehicle Inquiry",
      name,
      email,
      phone,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      message,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully. Concierge will contact you shortly.",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get authenticated user's submitted inquiries
const getMyInquiries = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const inquiries = await Inquiry.find({ user: userId }).sort({ createdAt: -1 }).populate("car");

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all customer inquiries (Admin only)
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .populate("car")
      .populate("user", "email role");

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update inquiry status (Admin only)
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: "Inquiry status updated successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
};
