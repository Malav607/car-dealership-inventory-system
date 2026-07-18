const request = require("supertest");
const app = require("../src/app");
const Car = require("../src/models/Car");

describe("GET /api/cars", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return an empty list of cars when inventory is empty", async () => {
    // Mock Car.find to return an empty array without hitting the database
    const findSpy = jest.spyOn(Car, "find").mockResolvedValue([]);

    const res = await request(app).get("/api/cars");
    
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

    const res = await request(app).get("/api/cars");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: mockCars,
    });
    expect(findSpy).toHaveBeenCalledTimes(1);
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

    const res = await request(app).get("/api/cars/search?make=Toyota");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: [{ make: "Toyota", model: "Camry", price: 25000 }],
    });
    expect(findSpy).toHaveBeenCalledTimes(1);
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
      .send({ price: 27000 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Car not found",
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });
});
