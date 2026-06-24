import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware/requireAuth.js";

const router = Router();

// Public — anyone can submit a registration intake
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName, email, phone, dateOfBirth, gender, maritalStatus,
      address, emergencyContact, emergencyPhone, serviceType, planId,
      allergies, medicalHistory,
    } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({ success: false, message: "Full name, email and phone are required" });
      return;
    }

    const existing = await prisma.clientRegistration.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      res.status(409).json({ success: false, message: "A registration with this email already exists" });
      return;
    }

    const registration = await prisma.clientRegistration.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        maritalStatus: maritalStatus || null,
        address: address || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        serviceType: serviceType || null,
        planId: planId || null,
        allergies: allergies || null,
        medicalHistory: medicalHistory || null,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted. Our team will review your application within 24 hours.",
      data: { id: registration.id },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// Admin — list all registrations
router.get("/", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [registrations, total] = await Promise.all([
      prisma.clientRegistration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.clientRegistration.count({ where }),
    ]);

    res.json({ data: registrations, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin — approve a registration (creates a Patient record)
router.post("/:id/approve", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const reg = await prisma.clientRegistration.findUnique({ where: { id: req.params.id } });
    if (!reg) { res.status(404).json({ message: "Registration not found" }); return; }
    if (reg.status !== "PENDING") { res.status(409).json({ message: "Registration already processed" }); return; }

    const nameParts = reg.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "-";

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email: reg.email,
        phone: reg.phone,
        dateOfBirth: reg.dateOfBirth ? new Date(reg.dateOfBirth) : null,
        gender: reg.gender?.toUpperCase() || "NOT_SPECIFIED",
        maritalStatus: reg.maritalStatus?.toUpperCase() || "NOT_SPECIFIED",
        allergies: reg.allergies ? reg.allergies.split(",").map((a) => a.trim()) : [],
        medicalHistory: reg.medicalHistory || null,
        emergencyContactName: reg.emergencyContact || null,
        emergencyContactPhone: reg.emergencyPhone || null,
        address: reg.address || null,
        serviceType: reg.serviceType || null,
        planId: reg.planId || null,
        status: "ACTIVE",
      },
    });

    await prisma.clientRegistration.update({
      where: { id: reg.id },
      data: { status: "APPROVED", reviewedAt: new Date(), reviewedBy: req.user?.id, adminNotes: req.body.notes || null },
    });

    res.json({ success: true, patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin — reject a registration
router.post("/:id/reject", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const reg = await prisma.clientRegistration.findUnique({ where: { id: req.params.id } });
    if (!reg) { res.status(404).json({ message: "Registration not found" }); return; }

    const updated = await prisma.clientRegistration.update({
      where: { id: reg.id },
      data: { status: "REJECTED", reviewedAt: new Date(), reviewedBy: req.user?.id, adminNotes: req.body.notes || null },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
