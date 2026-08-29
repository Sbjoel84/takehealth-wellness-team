import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

// All routes here are scoped to the authenticated user — a client only ever
// sees their own profile, appointments and activity.
const router = Router();
router.use(requireAuth);

async function getMyPatient(userId: string) {
  return prisma.patient.findFirst({
    where: { userId },
    include: {
      assignedProvider: {
        select: { id: true, name: true, type: true, specialty: true, location: true },
      },
    },
  });
}

// GET /api/me — profile, membership status, assigned instructor, source registration
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const patient = await getMyPatient(userId);
    const registration = patient?.id
      ? await prisma.clientRegistration.findFirst({ where: { patientId: patient.id } })
      : await prisma.clientRegistration.findFirst({
          where: { email: req.user!.email },
          orderBy: { createdAt: "desc" },
        });

    res.json({
      user: {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      patient,
      registration: registration
        ? {
            id: registration.id,
            status: registration.status,
            serviceType: registration.serviceType,
            planId: registration.planId,
            createdAt: registration.createdAt,
          }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/me/appointments — this client's full schedule (ascending by time)
router.get("/appointments", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const appointments = await prisma.appointment.findMany({
      where: { patient: { userId } },
      include: {
        provider: { select: { name: true, type: true, specialty: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });
    res.json({ data: appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/me/activity — recent events on this client's journey
router.get("/activity", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const activity = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ data: activity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
