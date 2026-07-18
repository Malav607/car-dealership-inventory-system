const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully register a new user and return a token", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      role: "User",
    };

    const mockSavedUser = {
      _id: "60d0fe4f5311236168a109cc",
      email: "test@example.com",
      role: "User",
      createdAt: new Date(),
    };

    // Spy on User methods
    const findOneSpy = jest.spyOn(User, "findOne").mockResolvedValue(null);
    const createSpy = jest.spyOn(User, "create").mockResolvedValue(mockSavedUser);

    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.data).toEqual({
      _id: mockSavedUser._id,
      email: mockSavedUser.email,
      role: mockSavedUser.role,
    });
    expect(res.body.token).toBeDefined();
    expect(findOneSpy).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(createSpy).toHaveBeenCalled();
  });

  it("should return 400 if user email already exists", async () => {
    const userData = {
      email: "existing@example.com",
      password: "password123",
    };

    const findOneSpy = jest.spyOn(User, "findOne").mockResolvedValue({ email: "existing@example.com" });

    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Email already registered");
    expect(findOneSpy).toHaveBeenCalledWith({ email: "existing@example.com" });
  });
});
