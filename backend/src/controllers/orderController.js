const Order = require("../models/Order");
const Car = require("../models/Car");

// Create a new vehicle order (Purchase)
const createOrder = async (req, res) => {
  try {
    const { carId, shippingAddress, deliveryCoords, paymentMethod } = req.body;
    const userId = req.user._id || req.user.id;

    if (!carId || !shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      return res.status(400).json({
        success: false,
        message: "Missing required order details or shipping address fields",
      });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is currently out of stock",
      });
    }

    // Decrement inventory stock
    car.quantity -= 1;
    if (car.quantity === 0) {
      car.status = "Sold";
    }
    await car.save();

    const carImage = (car.images && car.images.length > 0) ? car.images[0] : "";

    const order = await Order.create({
      user: userId,
      car: car._id,
      carDetails: {
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        image: carImage,
      },
      totalAmount: car.price,
      shippingAddress,
      deliveryCoords: deliveryCoords || { lat: 34.0522, lng: -118.2437 },
      paymentMethod: paymentMethod || "Credit Card (Simulated)",
      paymentStatus: "Paid",
      status: "Processing",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get authenticated user's order history
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("car");

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single order details by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user._id || req.user.id).toString();
    const userRole = req.user.role;

    const order = await Order.findById(id).populate("car").populate("user", "email role");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user._id.toString() !== userId && userRole !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied to this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("car")
      .populate("user", "email role");

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order fulfillment status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Handle cancellation stock restoration
    if (status === "Cancelled" && order.status !== "Cancelled") {
      const car = await Car.findById(order.car);
      if (car) {
        car.quantity += 1;
        if (car.quantity > 0 && car.status === "Sold") {
          car.status = "Available";
        }
        await car.save();
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin Analytics Dashboard Data
const getAdminAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();

    const totalRevenue = orders.reduce((acc, curr) => {
      return curr.status !== "Cancelled" ? acc + curr.totalAmount : acc;
    }, 0);

    const totalVehicles = await Car.countDocuments();
    const cars = await Car.find();
    
    const inventoryValuation = cars.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const lowStockCars = cars.filter((c) => c.quantity <= 2);

    // Group sales by category
    const categoryStats = {};
    cars.forEach((c) => {
      if (!categoryStats[c.category]) {
        categoryStats[c.category] = { count: 0, totalValuation: 0 };
      }
      categoryStats[c.category].count += c.quantity;
      categoryStats[c.category].totalValuation += c.price * c.quantity;
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalVehicles,
        inventoryValuation,
        lowStockCount: lowStockCars.length,
        lowStockCars,
        categoryStats,
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminAnalytics,
};
