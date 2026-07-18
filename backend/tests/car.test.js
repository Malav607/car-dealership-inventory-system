const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const Car = require("../src/models/Car");

// Generate tokens for testing
const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
const adminToken = jwt.sign({ id: "admin_id", role: "Admin" }, jwtSecret);
const userToken = jwt.sign({ id: "user_id", role: "User" }, jwtSecret);

describe("GET /api/cars", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return an empty list of cars when inventory is empty", async () => {
    const findSpy = jest.spyOn(Car, "find").mockResolvedValue([]);

    const res = await request(app)
      .get("/api/cars")
      .set("Authorization", `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: [],
    });
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  it("should return all cars in the inventory when they exist", async () => {
    const mockCars = [
      {
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 25000,
        mileage: 15000,
        fuelType: "Hybrid",
        transmission: "Automatic",
        color: "Silver",
        status: "Available",
      },
      {
        make: "Honda",
        model: "Civic",
        year: 2021,
        price: 22000,
        mileage: 20000,
        fuelType: "Petrol",
        transmission: "Automatic",
        color: "Blue",
        status: "Available",
      },
    ];

    const findSpy = jest.spyOn(Car, "find").mockResolvedValue(mockCars);

    const res = await request(app)
      .get("/api/cars")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: mockCars,
    });
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if request is made without a token", async () => {
    const res = await request(app).get("/api/cars");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/cars/search", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return matching cars when searching by query parameters", async () => {
    const mockCars = [
      { make: "Toyota", model: "Camry", price: 25000 },
      { make: "Honda", model: "Civic", price: 22000 },
    ];

    const findSpy = jest.spyOn(Car, "find").mockImplementation((query) => {
      if (query && query.make && query.make.$regex) {
        const regex = query.make.$regex;
        return Promise.resolve(mockCars.filter((c) => regex.test(c.make)));
      }
      return Promise.resolve(mockCars);
    });

    const res = await request(app)
      .get("/api/cars/search?make=Toyota")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: [{ make: "Toyota", model: "Camry", price: 25000 }],
    });
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if request is made without a token", async () => {
    const res = await request(app).get("/api/cars/search?make=Toyota");
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/cars/:id", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should update a car and return the updated details", async () => {
    const updatedCar = {
      _id: "60d0fe4f5311236168a109ca",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      price: 26000,
      mileage: 15000,
      fuelType: "Hybrid",
      transmission: "Automatic",
      color: "Silver",
      status: "Available",
    };

    const updateSpy = jest.spyOn(Car, "findByIdAndUpdate").mockResolvedValue(updatedCar);

    const res = await request(app)
      .put("/api/cars/60d0fe4f5311236168a109ca")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        year: 2023,
        price: 26000,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Car updated successfully",
      data: updatedCar,
    });
    expect(updateSpy).toHaveBeenCalledWith(
      "60d0fe4f5311236168a109ca",
      { year: 2023, price: 26000 },
      { new: true, runValidators: true }
    );
  });

  it("should return 404 if the car to update is not found", async () => {
    const updateSpy = jest.spyOn(Car, "findByIdAndUpdate").mockResolvedValue(null);

    const res = await request(app)
      .put("/api/cars/60d0fe4f5311236168a109cb")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 27000 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Car not found",
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if request is made without a token", async () => {
    const res = await request(app)
      .put("/api/cars/60d0fe4f5311236168a109ca")
      .send({ price: 27000 });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/cars/:id", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should delete a car and return the deleted details (Admin only)", async () => {
    const deletedCar = {
      _id: "60d0fe4f5311236168a109ca",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      price: 25000,
      mileage: 15000,
      fuelType: "Hybrid",
      transmission: "Automatic",
      color: "Silver",
      status: "Available",
    };

    const deleteSpy = jest.spyOn(Car, "findByIdAndDelete").mockResolvedValue(deletedCar);

    const res = await request(app)
      .delete("/api/cars/60d0fe4f5311236168a109ca")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Car deleted successfully",
      data: deletedCar,
    });
    expect(deleteSpy).toHaveBeenCalledWith("60d0fe4f5311236168a109ca");
  });

  it("should return 403 if user is not an Admin", async () => {
    const res = await request(app)
      .delete("/api/cars/60d0fe4f5311236168a109ca")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      success: false,
      message: "Forbidden: Access denied",
    });
  });

  it("should return 404 if the car to delete is not found", async () => {
    const deleteSpy = jest.spyOn(Car, "findByIdAndDelete").mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/cars/60d0fe4f5311236168a109cb")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Car not found",
    });
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if request is made without a token", async () => {
    const res = await request(app).delete("/api/cars/60d0fe4f5311236168a109ca");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/cars/:id/purchase", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully purchase a car and decrease its quantity by 1", async () => {
    const mockCar = {
      _id: "60d0fe4f5311236168a109ca",
      make: "Toyota",
      model: "Camry",
      price: 25000,
      quantity: 5,
      save: jest.fn().mockResolvedValue({
        _id: "60d0fe4f5311236168a109ca",
        make: "Toyota",
        model: "Camry",
        price: 25000,
        quantity: 4,
      }),
    };

    const findSpy = jest.spyOn(Car, "findById").mockResolvedValue(mockCar);

    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109ca/purchase")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Vehicle purchased successfully",
      data: {
        _id: "60d0fe4f5311236168a109ca",
        make: "Toyota",
        model: "Camry",
        price: 25000,
        quantity: 4,
      },
    });
    expect(findSpy).toHaveBeenCalledWith("60d0fe4f5311236168a109ca");
    expect(mockCar.save).toHaveBeenCalled();
  });

  it("should return 400 if the car is out of stock", async () => {
    const mockCar = {
      _id: "60d0fe4f5311236168a109ca",
      make: "Toyota",
      model: "Camry",
      price: 25000,
      quantity: 0,
    };

    const findSpy = jest.spyOn(Car, "findById").mockResolvedValue(mockCar);

    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109ca/purchase")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "Vehicle out of stock",
    });
    expect(findSpy).toHaveBeenCalledWith("60d0fe4f5311236168a109ca");
  });

  it("should return 404 if the car is not found", async () => {
    const findSpy = jest.spyOn(Car, "findById").mockResolvedValue(null);

    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109cb/purchase")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Car not found",
    });
    expect(findSpy).toHaveBeenCalledWith("60d0fe4f5311236168a109cb");
  });
});

describe("POST /api/cars/:id/restock", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully restock a car and increase its quantity (Admin only)", async () => {
    const mockCar = {
      _id: "60d0fe4f5311236168a109ca",
      make: "Toyota",
      model: "Camry",
      price: 25000,
      quantity: 5,
      save: jest.fn().mockResolvedValue({
        _id: "60d0fe4f5311236168a109ca",
        make: "Toyota",
        model: "Camry",
        price: 25000,
        quantity: 15,
      }),
    };

    const findSpy = jest.spyOn(Car, "findById").mockResolvedValue(mockCar);

    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109ca/restock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Vehicle restocked successfully",
      data: {
        _id: "60d0fe4f5311236168a109ca",
        make: "Toyota",
        model: "Camry",
        price: 25000,
        quantity: 15,
      },
    });
    expect(findSpy).toHaveBeenCalledWith("60d0fe4f5311236168a109ca");
    expect(mockCar.save).toHaveBeenCalled();
  });

  it("should return 400 if the restock quantity is missing or invalid", async () => {
    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109ca/restock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: -5 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid quantity");
  });

  it("should return 403 if a non-admin user attempts to restock", async () => {
    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109ca/restock")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Forbidden: Access denied");
  });

  it("should return 404 if the car to restock is not found", async () => {
    const findSpy = jest.spyOn(Car, "findById").mockResolvedValue(null);

    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109cb/restock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Car not found",
    });
    expect(findSpy).toHaveBeenCalledWith("60d0fe4f5311236168a109cb");
  });

  it("should return 401 if request is made without a token", async () => {
    const res = await request(app)
      .post("/api/cars/60d0fe4f5311236168a109ca/restock")
      .send({ quantity: 10 });
    expect(res.status).toBe(401);
  });
});
