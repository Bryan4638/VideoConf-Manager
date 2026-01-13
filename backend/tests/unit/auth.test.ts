import { describe, it, expect, vi, beforeEach } from "vitest";
import { authMiddleware } from "../../src/middleware/auth";
import jwt from "jsonwebtoken";

// Mock jsonwebtoken
vi.mock("jsonwebtoken");

describe("Auth Middleware Unit Tests", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should return 401 if no token provided", () => {
    req.headers.authorization = null;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalid-token";
    (jwt.verify as any).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token invalid" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if token is valid", () => {
    const mockDecoded = { id: "123" };
    req.headers.authorization = "Bearer valid-token";
    (jwt.verify as any).mockReturnValue(mockDecoded);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", expect.any(String)); // secret key
    expect(req.userId).toEqual(mockDecoded.id);
    expect(next).toHaveBeenCalled();
  });
});
