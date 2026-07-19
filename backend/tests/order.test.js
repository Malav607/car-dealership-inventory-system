const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const Order = require("../src/models/Order");
const Car = require("../src/models/Car");

const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
const adminToken = jwt.sign({ id: "60d0fe4f5311236168a109aa", role: "Admin" }, jwtSecret);
const userToken = jwt.sign({ id: "60d0fe4f5311236168a109bb", role: "User" }, jwtSecret);

describe("POST /api/orders", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should create an order successfully when valid data is provided", async () => {
    const mockCar = {
      _id: "60d0fe4f5311236168a109ca",
      make: "Porsche",
      model: "911",
      year: 2024,
      price: 200000,
      quantity: 2,
      images: ["http://example.com/porsche.jpg"],
      save: jest.fn().mockResolvedValue(true),
    };

    const mockOrder = {
      _id: "60d0fe4f5311236168a109dd",
      user: "60d0fe4f5311236168a109bb",
      car: "60d0fe4f5311236168a109ca",
      totalAmount: 200000,
      status: "Processing",
      shippingAddress: {
        street: "123 Main St",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
      },
    };

    jest.spyOn(Car, "findById").mockResolvedValue(mockCar);
    jest.spyOn(Order, "create").mockResolvedValue(mockOrder);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        carId: "60d0fe4f5311236168a109ca",
        shippingAddress: {
          street: "123 Main St",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe("60d0fe4f5311236168a109dd");
    expect(mockCar.save).toHaveBeenCalled();
  });

  it("should return 400 if shipping address is missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        carId: "60d0fe4f5311236168a109ca",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/orders/my-orders", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return order history for authenticated user", async () => {
    const mockOrders = [
      { _id: "order1", totalAmount: 100000, status: "Processing" },
    ];

    const populateSpy = jest.fn().mockResolvedValue(mockOrders);
    const sortSpy = jest.fn().mockReturnValue({ populate: populateSpy });
    jest.spyOn(Order, "find").mockReturnValue({ sort: sortSpy });

    const res = await request(app)
      .get("/api/orders/my-orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });
});

describe("GET /api/orders/analytics (Admin)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return analytics summary for admin user", async () => {
    jest.spyOn(Order, "countDocuments").mockResolvedValue(10);
    jest.spyOn(Order, "find").mockResolvedValue([
      { totalAmount: 50000, status: "Delivered" },
      { totalAmount: 80000, status: "Confirmed" },
    ]);
    jest.spyOn(Car, "countDocuments").mockResolvedValue(5);
    jest.spyOn(Car, "find").mockResolvedValue([
      { category: "Coupe", quantity: 1, price: 100000 },
    ]);

    const res = await request(app)
      .get("/api/orders/analytics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalOrders).toBe(10);
    expect(res.body.data.totalRevenue).toBe(130000);
  });

  it("should return 403 for non-admin user", async () => {
    const res = await request(app)
      .get("/api/orders/analytics")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
