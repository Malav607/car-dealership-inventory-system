const { protect, authorize } = require("../src/middleware/authMiddleware");
const jwt = require("jsonwebtoken");

describe("Auth Middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("protect middleware", () => {
    it("should call next() if a valid token is provided", () => {
      const payload = { id: "user_id", role: "User" };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "default_jwt_secret");
      mockReq.headers.authorization = `Bearer ${token}`;

      protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe("user_id");
      expect(mockReq.user.role).toBe("User");
    });

    it("should return 401 if authorization header is missing", () => {
      protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Not authorized, no token provided",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", () => {
      mockReq.headers.authorization = "Bearer invalid_token";

      protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Not authorized, token verification failed",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("authorize middleware", () => {
    it("should call next() if user role is authorized", () => {
      mockReq.user = { role: "Admin" };
      
      const middleware = authorize("Admin");
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 403 if user role is not authorized", () => {
      mockReq.user = { role: "User" };
      
      const middleware = authorize("Admin");
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Forbidden: Access denied",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
