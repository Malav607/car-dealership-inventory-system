const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const Order = require("../src/models/Order");
const Car = require("../src/models/Car");
const Inquiry = require("../src/models/Inquiry");

const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
const adminToken = jwt.sign({ id: "60d0fe4f5311236168a109aa", role: "Admin" }, jwtSecret);
const userToken = jwt.sign({ id: "60d0fe4f5311236168a109bb", role: "User" }, jwtSecret);

describe("POST /api/orders", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a new order successfully", async () => {
    jest.spyOn(Car, "findById").mockResolvedValue({
      _id: "60d0fe4f5311236168a109cc",
      make: "Porsche",
      model: "911",
      year: 2024,
      price: 150000,
      quantity: 1,
      images: ["image.jpg"],
      save: jest.fn().mockResolvedValue(true),
    });

    jest.spyOn(Order, "create").mockResolvedValue({
      _id: "60d0fe4f5311236168a109dd",
      user: "60d0fe4f5311236168a109bb",
      car: "60d0fe4f5311236168a109cc",
      carDetails: { make: "Porsche", model: "911", year: 2024, price: 150000 },
      totalAmount: 150000,
      shippingAddress: { street: "123 Main St", city: "Rajkot", state: "Gujarat", zipCode: "360001", country: "India" },
      status: "Order Confirmed",
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        carId: "60d0fe4f5311236168a109cc",
        shippingAddress: { street: "123 Main St", city: "Rajkot", state: "Gujarat", zipCode: "360001", country: "India" },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAmount).toBe(150000);
  });
});

describe("GET /api/orders/my-orders", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return orders for authenticated user", async () => {
    const mockPopulate = jest.fn().mockResolvedValue([
      { _id: "60d0fe4f5311236168a109dd", totalAmount: 150000 },
    ]);
    const mockSort = jest.fn().mockReturnValue({ populate: mockPopulate });
    jest.spyOn(Order, "find").mockReturnValue({ sort: mockSort });

    const res = await request(app)
      .get("/api/orders/my-orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
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
    jest.spyOn(Order, "aggregate").mockImplementation((pipeline) => {
      if (pipeline[0]?.$group?._id === "$status") {
        return Promise.resolve([{ name: "Order Confirmed", value: 2 }]);
      }
      return Promise.resolve([{ _id: { year: 2026, month: 7 }, revenue: 130000, orders: 2 }]);
    });
    jest.spyOn(Inquiry, "aggregate").mockResolvedValue([
      { _id: { year: 2026, month: 7 }, inquiries: 1 },
    ]);
    jest.spyOn(Inquiry, "countDocuments").mockResolvedValue(1);

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
