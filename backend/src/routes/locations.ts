import { Router, Response } from "express";
import prisma from "../config/database";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/locations
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    });
    return res.json(locations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching locations" });
  }
});

// GET /api/locations/:id
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const location = await prisma.location.findUnique({ where: { id } });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    return res.json(location);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching location" });
  }
});

// POST /api/locations
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, capacity, hasVideoEquipment } = req.body;

    if (!name || !address || capacity === undefined) {
      return res
        .status(400)
        .json({ error: "Name, address, and capacity are required" });
    }

    const location = await prisma.location.create({
      data: {
        name,
        address,
        capacity: parseInt(capacity),
        hasVideoEquipment: Boolean(hasVideoEquipment),
      },
    });

    return res.status(201).json(location);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating location" });
  }
});

// PUT /api/locations/:id
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, capacity, hasVideoEquipment } = req.body;

    const location = await prisma.location.update({
      where: { id },
      data: {
        name,
        address,
        capacity: capacity !== undefined ? parseInt(capacity) : undefined,
        hasVideoEquipment:
          hasVideoEquipment !== undefined
            ? Boolean(hasVideoEquipment)
            : undefined,
      },
    });

    return res.json(location);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating location" });
  }
});

// DELETE /api/locations/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if location is used by any conference
    const conferences = await prisma.videoConference.findFirst({
      where: { locationId: id },
    });

    if (conferences) {
      return res.status(400).json({
        error:
          "Cannot delete location as it is being used by one or more conferences",
      });
    }

    await prisma.location.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting location" });
  }
});

export default router;
