import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { auth } from "../auth.js";
import { requireAdmin } from "../middleware/requireAuth.js";
import { logActivity } from "../lib/activity.js";

const router = Router();

// Public — anyone can submit a registration intake
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName, email, phone, dateOfBirth, gender, maritalStatus,
      address, emergencyContact, emergencyPhone, serviceType, planId,
      allergies, medicalHistory, password,
    } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({ success: false, message: "Full name, email and phone are required" });
      return;
    }

    if (password != null && String(password).length < 8) {
      res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
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
        // Held only until an admin approves and the login account is created.
        password: password ? String(password) : null,
        status: "PENDING",
      },
    });

    await logActivity({
      type: "REGISTRATION_SUBMITTED",
      message: `Registration submitted for ${registration.serviceType || "wellness services"}.`,
      patientId: null,
      metadata: { registrationId: registration.id, email: registration.email },
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

// Admin — approve a registration.
// Creates the login account (better-auth User, role CLIENT) + a linked Patient record,
// then clears the stored password. The client can log in from this point on.
router.post("/:id/approve", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const reg = await prisma.clientRegistration.findUnique({ where: { id: req.params.id } });
    if (!reg) { res.status(404).json({ message: "Registration not found" }); return; }
    if (reg.status !== "PENDING") { res.status(409).json({ message: "Registration already processed" }); return; }

    const password: string | undefined = reg.password || req.body.password || undefined;
    if (!password || password.length < 8) {
      res.status(400).json({
        message: "No password on file for this registration. Provide a temporary `password` (min 8 chars) to create the account.",
      });
      return;
    }

    // ── 1. Ensure a login account exists ────────────────────────────────────
    let user = await prisma.user.findUnique({ where: { email: reg.email } });
    if (!user) {
      try {
        await auth.api.signUpEmail({ body: { name: reg.fullName, email: reg.email, password } });
      } catch (signUpErr) {
        // Treat "already exists" as recoverable; anything else is fatal.
        user = await prisma.user.findUnique({ where: { email: reg.email } });
        if (!user) {
          console.error("signUpEmail failed:", signUpErr);
          res.status(502).json({ message: "Could not create the login account. Please try again." });
          return;
        }
      }
      user = user || (await prisma.user.findUnique({ where: { email: reg.email } }));
    }
    if (!user) { res.status(500).json({ message: "Account creation did not complete" }); return; }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "CLIENT", emailVerified: true },
    });

    // ── 2. Create (or reuse) the Patient record ─────────────────────────────
    const nameParts = reg.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "-";

    let patient = await prisma.patient.findUnique({ where: { userId: user.id } });
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          userId: user.id,
          registrationId: reg.id,
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
    }

    // ── 3. Finalise the registration (and destroy the stored password) ──────
    await prisma.clientRegistration.update({
      where: { id: reg.id },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: req.user?.id,
        adminNotes: req.body.notes || null,
        patientId: patient.id,
        password: null,
      },
    });

    await logActivity({
      type: "REGISTRATION_APPROVED",
      message: "Your registration was approved — welcome to takehealth! You can now sign in.",
      userId: user.id,
      patientId: patient.id,
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
