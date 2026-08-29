import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { logActivity, type ActivityType } from "../lib/activity.js";

const router = Router();
router.use(requireAuth);

const fmtWhen = (d: Date) =>
  d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

// Record an appointment event on the owning client's activity feed (best-effort).
async function logAppointmentActivity(appointmentId: string, type: ActivityType, message: string) {
  try {
    const appt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: { select: { id: true, userId: true } } },
    });
    if (!appt) return;
    await logActivity({
      type,
      message,
      userId: appt.patient.userId,
      patientId: appt.patient.id,
      metadata: { appointmentId },
    });
  } catch (err) {
    console.error("logAppointmentActivity failed:", (err as Error).message);
  }
}

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (from || to) {
      where.scheduledAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: { select: { firstName: true, lastName: true, phone: true } },
          provider: { select: { name: true, type: true } },
        },
        orderBy: { scheduledAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({ data: appointments, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        patient: true,
        provider: true,
      },
    });
    if (!appointment) { res.status(404).json({ message: "Appointment not found" }); return; }
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, providerId, serviceId, scheduledAt, type, notes, duration } = req.body;

    if (!patientId || !providerId || !scheduledAt) {
      res.status(400).json({ message: "patientId, providerId and scheduledAt are required" });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        providerId,
        serviceId: serviceId || null,
        userId: req.user?.id || null,
        scheduledAt: new Date(scheduledAt),
        type: type || "IN_PERSON",
        notes: notes || null,
        duration: duration || null,
        status: "PENDING",
      },
      include: {
        patient: { select: { id: true, userId: true, firstName: true, lastName: true, phone: true } },
        provider: { select: { name: true } },
      },
    });

    await logActivity({
      type: "APPOINTMENT_SCHEDULED",
      message: `Appointment scheduled with ${appointment.provider.name} for ${fmtWhen(appointment.scheduledAt)}.`,
      userId: appointment.patient.userId,
      patientId: appointment.patient.id,
      metadata: { appointmentId: appointment.id },
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const updateStatus = (status: string, activity?: { type: ActivityType; message: string }) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const appt = await prisma.appointment.findUnique({ where: { id: req.params.id } });
      if (!appt) { res.status(404).json({ message: "Appointment not found" }); return; }

      const updated = await prisma.appointment.update({
        where: { id: req.params.id },
        data: { status },
      });

      if (activity) {
        await logAppointmentActivity(updated.id, activity.type, activity.message);
      }
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

router.patch("/:id/confirm", updateStatus("CONFIRMED", {
  type: "APPOINTMENT_CONFIRMED",
  message: "Your appointment has been confirmed.",
}));
router.patch("/:id/complete", updateStatus("COMPLETED", {
  type: "APPOINTMENT_COMPLETED",
  message: "Your appointment was marked complete.",
}));
router.patch("/:id/cancel", async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED", cancelReason: req.body.reason || null },
    });
    await logAppointmentActivity(
      updated.id,
      "APPOINTMENT_CANCELLED",
      `Your appointment was cancelled${req.body.reason ? `: ${req.body.reason}` : ""}.`,
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:id/reschedule", async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheduledAt, reason } = req.body;
    if (!scheduledAt) { res.status(400).json({ message: "scheduledAt is required" }); return; }
    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { scheduledAt: new Date(scheduledAt), status: "RESCHEDULED", notes: reason || undefined },
    });
    await logAppointmentActivity(
      updated.id,
      "APPOINTMENT_RESCHEDULED",
      `Your appointment was moved to ${fmtWhen(updated.scheduledAt)}.`,
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const appt = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!appt) { res.status(404).json({ message: "Appointment not found" }); return; }
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
