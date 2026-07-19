const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const Inquiry = require("../src/models/Inquiry");

const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
const adminToken = jwt.sign({ id: "60d0fe4f5311236168a109aa", role: "Admin" }, jwtSecret);
const userToken = jwt.sign({ id: "60d0fe4f5311236168a109bb", role: "User" }, jwtSecret);

describe("POST /api/inquiries", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should create an inquiry successfully when valid data is sent", async () => {
    const mockInquiry = {
      _id: "inquiry123",
      user: "60d0fe4f5311236168a109bb",
      type: "Test Drive",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 9876543210",
      message: "Requesting test drive for Porsche 911 in Rajkot",
      status: "Pending",
    };

    jest.spyOn(Inquiry, "create").mockResolvedValue(mockInquiry);

    const res = await request(app)
      .post("/api/inquiries")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        type: "Test Drive",
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+91 9876543210",
        message: "Requesting test drive for Porsche 911 in Rajkot",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Rahul Sharma");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/inquiries")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Rahul Sharma",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/inquiries (Admin)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should allow admin to list all inquiries", async () => {
    const mockInquiries = [
      { _id: "inq1", name: "Rahul", type: "Test Drive", status: "Pending" },
    ];

    const populateCarSpy = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockInquiries),
    });
    const sortSpy = jest.fn().mockReturnValue({ populate: populateCarSpy });
    jest.spyOn(Inquiry, "find").mockReturnValue({ sort: sortSpy });

    const res = await request(app)
      .get("/api/inquiries")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("should return 403 for non-admin user", async () => {
    const res = await request(app)
      .get("/api/inquiries")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
