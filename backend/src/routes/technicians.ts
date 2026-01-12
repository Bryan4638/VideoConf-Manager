import { Router, Response } from "express";
import prisma from "../config/database";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/technicians
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const technicians = await prisma.technician.findMany({
      orderBy: { name: "asc" },
    });
    return res.json(technicians);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching technicians" });
  }
});

// GET /api/technicians/:id
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technician = await prisma.technician.findUnique({ where: { id } });

    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }

    return res.json(technician);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching technician" });
  }
});

// POST /api/technicians
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, specialization } = req.body;

    if (!name || !email || !phone || !specialization) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const technician = await prisma.technician.create({
      data: { name, email, phone, specialization },
    });

    return res.status(201).json(technician);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating technician" });
  }
});

// PUT /api/technicians/:id
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, specialization } = req.body;

    const technician = await prisma.technician.update({
      where: { id },
      data: { name, email, phone, specialization },
    });

    return res.json(technician);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating technician" });
  }
});

// DELETE /api/technicians/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if technician is assigned to any conference
    const assignments = await prisma.conferenceTechnician.findFirst({
      where: { technicianId: id },
    });

    if (assignments) {
      return res.status(400).json({
        error:
          "Cannot delete technician as they are assigned to one or more conferences",
      });
    }

    await prisma.technician.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting technician" });
  }
});

export default router;
