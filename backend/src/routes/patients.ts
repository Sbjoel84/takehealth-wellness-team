import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({ data: patients, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        appointments: {
          include: { provider: { select: { name: true, type: true } } },
          orderBy: { scheduledAt: "desc" },
          take: 10,
        },
      },
    });
    if (!patient) { res.status(404).json({ message: "Patient not found" }); return; }
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName, lastName, dateOfBirth, gender, maritalStatus, phone, email,
      bloodType, allergies, medicalHistory, emergencyContactName,
      emergencyContactPhone, address, serviceType, planId,
    } = req.body;

    if (!firstName || !lastName) {
      res.status(400).json({ message: "First name and last name are required" });
      return;
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email: email?.toLowerCase().trim() || null,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || "NOT_SPECIFIED",
        maritalStatus: maritalStatus || "NOT_SPECIFIED",
        bloodType: bloodType || null,
        allergies: Array.isArray(allergies) ? allergies : allergies ? [allergies] : [],
        medicalHistory: medicalHistory || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        address: address || null,
        serviceType: serviceType || null,
        planId: planId || null,
      },
    });

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!patient) { res.status(404).json({ message: "Patient not found" }); return; }

    const updated = await prisma.patient.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!patient) { res.status(404).json({ message: "Patient not found" }); return; }

    await prisma.patient.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
