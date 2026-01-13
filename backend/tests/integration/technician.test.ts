import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/index";

// Mock Prisma using vi.hoisted()
const prismaMock = vi.hoisted(() => ({
  technician: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  conferenceTechnician: {
    findFirst: vi.fn(),
  },
}));

vi.mock("../../src/config/database", () => ({
  default: prismaMock,
}));

// Mock Auth Middleware to bypass authentication
vi.mock("../../src/middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { userId: "test-user" };
    next();
  },
}));

describe("Technician API Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/technicians - should return all technicians", async () => {
    const mockTechnicians = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "123",
        specialization: "Audio",
      },
    ];
    prismaMock.technician.findMany.mockResolvedValue(mockTechnicians);

    const res = await request(app).get("/api/technicians");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTechnicians);
    expect(prismaMock.technician.findMany).toHaveBeenCalledTimes(1);
  });

  it("POST /api/technicians - should create a new technician", async () => {
    const newTech = {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "456",
      specialization: "Video",
    };
    const createdTech = { id: "2", ...newTech };

    prismaMock.technician.create.mockResolvedValue(createdTech);

    const res = await request(app).post("/api/technicians").send(newTech);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdTech);
    expect(prismaMock.technician.create).toHaveBeenCalledWith({
      data: newTech,
    });
  });

  it("DELETE /api/technicians/:id - should delete a technician if not assigned", async () => {
    prismaMock.conferenceTechnician.findFirst.mockResolvedValue(null); // Not assigned
    prismaMock.technician.delete.mockResolvedValue({ id: "1" });

    const res = await request(app).delete("/api/technicians/1");

    expect(res.status).toBe(204);
    expect(prismaMock.technician.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });

  it("DELETE /api/technicians/:id - should fail if assigned to conference", async () => {
    prismaMock.conferenceTechnician.findFirst.mockResolvedValue({
      id: "rel-1",
    }); // Assigned

    const res = await request(app).delete("/api/technicians/1");

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Cannot delete technician");
    expect(prismaMock.technician.delete).not.toHaveBeenCalled();
  });
});
