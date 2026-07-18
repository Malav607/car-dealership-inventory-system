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
