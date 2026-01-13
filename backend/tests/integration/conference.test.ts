import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/index";

// Mock Prisma
const prismaMock = vi.hoisted(() => ({
  videoConference: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../src/config/database", () => ({
  default: prismaMock,
}));

// Mock Auth Middleware
vi.mock("../../src/middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { userId: "test-user" };
    next();
  },
}));

describe("Conference API Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/conferences - should return list of conferences", async () => {
    const mockConferences = [
      {
        id: "conf1",
        title: "Tech Summit",
        description: "Annual meet",
        date: "2023-12-01",
        startTime: "10:00",
        endTime: "12:00",
        participantCount: 100,
        status: "scheduled",
        locationId: "loc1",
        technicians: [{ technicianId: "tech1" }],
        location: { name: "Main Hall" },
      },
    ];

    prismaMock.videoConference.findMany.mockResolvedValue(mockConferences);

    const res = await request(app).get("/api/conferences");

    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe("Tech Summit");
    expect(res.body[0].technicianIds).toEqual(["tech1"]);
  });

  it("POST /api/conferences - should create conference", async () => {
    const newConf = {
      title: "Workshop",
      date: "2023-12-02",
      startTime: "14:00",
      endTime: "16:00",
      locationId: "loc2",
      technicianIds: ["tech2"],
    };

    const createdConf = {
      id: "conf2",
      ...newConf,
      technicians: [{ technicianId: "tech2" }],
    };

    prismaMock.videoConference.create.mockResolvedValue(createdConf);

    const res = await request(app).post("/api/conferences").send(newConf);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Workshop");
    expect(prismaMock.videoConference.create).toHaveBeenCalled();
  });

  it("POST /api/conferences - should fail validation w/o required fields", async () => {
    const invalidConf = {
      title: "Missing Date",
      // date missing
      startTime: "10:00",
    };

    const res = await request(app).post("/api/conferences").send(invalidConf);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
