import { Router, Response } from "express";
import prisma from "../config/database";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/conferences
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const conferences = await prisma.videoConference.findMany({
      include: {
        location: true,
        technicians: {
          include: {
            technician: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    // Transform to match frontend format
    const transformed = conferences.map((conf) => ({
      id: conf.id,
      title: conf.title,
      description: conf.description,
      date: conf.date,
      startTime: conf.startTime,
      endTime: conf.endTime,
      participantCount: conf.participantCount,
      status: conf.status,
      locationId: conf.locationId,
      technicianIds: conf.technicians.map((t) => t.technicianId),
    }));

    return res.json(transformed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching conferences" });
  }
});

// GET /api/conferences/:id
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const conference = await prisma.videoConference.findUnique({
      where: { id },
      include: {
        location: true,
        technicians: {
          include: {
            technician: true,
          },
        },
      },
    });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    const transformed = {
      id: conference.id,
      title: conference.title,
      description: conference.description,
      date: conference.date,
      startTime: conference.startTime,
      endTime: conference.endTime,
      participantCount: conference.participantCount,
      status: conference.status,
      locationId: conference.locationId,
      technicianIds: conference.technicians.map((t) => t.technicianId),
    };

    return res.json(transformed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching conference" });
  }
});

// POST /api/conferences
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      locationId,
      technicianIds,
      participantCount,
      status,
    } = req.body;

    if (!title || !date || !startTime || !endTime || !locationId) {
      return res
        .status(400)
        .json({
          error: "Title, date, start time, end time, and location are required",
        });
    }

    const conference = await prisma.videoConference.create({
      data: {
        title,
        description: description || "",
        date,
        startTime,
        endTime,
        participantCount: participantCount || 0,
        status: status || "scheduled",
        locationId,
        technicians: {
          create: (technicianIds || []).map((techId: string) => ({
            technicianId: techId,
          })),
        },
      },
      include: {
        technicians: true,
      },
    });

    return res.status(201).json({
      id: conference.id,
      title: conference.title,
      description: conference.description,
      date: conference.date,
      startTime: conference.startTime,
      endTime: conference.endTime,
      participantCount: conference.participantCount,
      status: conference.status,
      locationId: conference.locationId,
      technicianIds: conference.technicians.map((t) => t.technicianId),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating conference" });
  }
});

// PUT /api/conferences/:id
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      locationId,
      technicianIds,
      participantCount,
      status,
    } = req.body;

    // Update conference base data
    const conference = await prisma.videoConference.update({
      where: { id },
      data: {
        title,
        description,
        date,
        startTime,
        endTime,
        participantCount,
        status,
        locationId,
      },
    });

    // If technicianIds provided, update the relation
    if (technicianIds !== undefined) {
      // Delete existing relations
      await prisma.conferenceTechnician.deleteMany({
        where: { conferenceId: id },
      });

      // Create new relations
      await prisma.conferenceTechnician.createMany({
        data: technicianIds.map((techId: string) => ({
          conferenceId: id,
          technicianId: techId,
        })),
      });
    }

    // Fetch updated conference with relations
    const updated = await prisma.videoConference.findUnique({
      where: { id },
      include: {
        technicians: true,
      },
    });

    return res.json({
      id: updated!.id,
      title: updated!.title,
      description: updated!.description,
      date: updated!.date,
      startTime: updated!.startTime,
      endTime: updated!.endTime,
      participantCount: updated!.participantCount,
      status: updated!.status,
      locationId: updated!.locationId,
      technicianIds: updated!.technicians.map((t) => t.technicianId),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating conference" });
  }
});

// DELETE /api/conferences/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Delete will cascade to ConferenceTechnician due to onDelete: Cascade
    await prisma.videoConference.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting conference" });
  }
});

export default router;
