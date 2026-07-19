const Car = require("../models/Car");

const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCars = async (req, res) => {
  try {
    const { page, limit, sort, search, make, fuelType, transmission, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { make: { $regex: new RegExp(search, "i") } },
        { model: { $regex: new RegExp(search, "i") } },
        { category: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }
    if (make) query.make = { $regex: new RegExp(make, "i") };
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (category) query.category = { $regex: new RegExp(category, "i") };

    let queryChain = Car.find(query);

    if (sort && typeof queryChain.sort === "function") {
      let sortOptions = { createdAt: -1 };
      if (sort === "price_asc") sortOptions = { price: 1 };
      if (sort === "price_desc") sortOptions = { price: -1 };
      if (sort === "year_desc") sortOptions = { year: -1 };
      queryChain = queryChain.sort(sortOptions);
    }

    if (page && limit && typeof queryChain.skip === "function") {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      queryChain = queryChain.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const cars = await queryChain;

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchCars = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice, fuelType, transmission, sort } = req.query;
    const query = {};

    if (make) {
      query.make = { $regex: new RegExp(make, "i") };
    }
    if (model) {
      query.model = { $regex: new RegExp(model, "i") };
    }
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }
    if (fuelType) {
      query.fuelType = fuelType;
    }
    if (transmission) {
      query.transmission = transmission;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    let sortOptions = {};
    if (sort === "price_asc") sortOptions = { price: 1 };
    if (sort === "price_desc") sortOptions = { price: -1 };
    if (sort === "year_desc") sortOptions = { year: -1 };

    let queryChain = Car.find(query);
    if (Object.keys(sortOptions).length > 0) {
      queryChain = queryChain.sort(sortOptions);
    }

    const cars = await queryChain;

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const purchaseCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle out of stock",
      });
    }

    car.quantity -= 1;
    if (car.quantity === 0) {
      car.status = "Sold";
    }

    const updatedCar = await car.save();

    res.status(200).json({
      success: true,
      message: "Vehicle purchased successfully",
      data: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const restockCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    car.quantity += quantity;
    if (car.quantity > 0 && car.status === "Sold") {
      car.status = "Available";
    }

    const updatedCar = await car.save();

    res.status(200).json({
      success: true,
      message: "Vehicle restocked successfully",
      data: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  searchCars,
  updateCar,
  deleteCar,
  purchaseCar,
  restockCar,
};