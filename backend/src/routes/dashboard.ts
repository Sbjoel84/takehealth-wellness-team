import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/overview", async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalPatients,
      newPatients,
      prevPeriodPatients,
      totalProviders,
      activeProviders,
      pendingProviders,
      totalAppointments,
      newAppointments,
      prevAppointments,
      confirmedAppointments,
      completedAppointments,
      prevCompletedAppointments,
      cancelledAppointments,
      pendingAppointments,
      noShowAppointments,
      pendingRegistrations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.patient.count(),
      prisma.patient.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.patient.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.healthServiceProvider.count(),
      prisma.healthServiceProvider.count({ where: { status: "ACTIVE" } }),
      prisma.healthServiceProvider.count({ where: { status: "PENDING" } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.appointment.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.appointment.count({ where: { status: "CONFIRMED" } }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
      prisma.appointment.count({ where: { status: "COMPLETED", updatedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.appointment.count({ where: { status: "CANCELLED" } }),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "NO_SHOW" } }),
      prisma.clientRegistration.count({ where: { status: "PENDING" } }),
    ]);

    const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
    const cancellationRate = totalAppointments > 0 ? Math.round((cancelledAppointments / totalAppointments) * 100) : 0;
    const noShowRate = totalAppointments > 0 ? Math.round((noShowAppointments / totalAppointments) * 100) : 0;

    const delta = (current: number, prev: number) =>
      prev === 0 ? 0 : Math.round(((current - prev) / prev) * 100);

    res.json({
      generatedAt: now.toISOString(),
      pendingRegistrations,
      overview: {
        window: { from: thirtyDaysAgo.toISOString(), to: now.toISOString() },
        users: { total: totalUsers, active: totalUsers, new: newPatients, newDelta: delta(newPatients, prevPeriodPatients) },
        patients: { total: totalPatients, new: newPatients, newDelta: delta(newPatients, prevPeriodPatients) },
        providers: { total: totalProviders, active: activeProviders, pendingVerification: pendingProviders },
        appointments: {
          total: totalAppointments,
          new: newAppointments,
          newDelta: delta(newAppointments, prevAppointments),
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          completedDelta: delta(completedAppointments, prevCompletedAppointments),
          cancelled: cancelledAppointments,
          pending: pendingAppointments,
          noShow: noShowAppointments,
          completionRate,
          cancellationRate,
          noShowRate,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/upcoming-appointments", async (_req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        scheduledAt: { gte: new Date() },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: {
        patient: { select: { firstName: true, lastName: true, phone: true } },
        provider: { select: { name: true } },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/recent-activity", async (_req: Request, res: Response): Promise<void> => {
  try {
    const [recentPatients, recentAppointments, recentRegistrations] = await Promise.all([
      prisma.patient.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, firstName: true, lastName: true, createdAt: true, serviceType: true } }),
      prisma.appointment.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { patient: { select: { firstName: true, lastName: true } } } }),
      prisma.clientRegistration.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, fullName: true, email: true, serviceType: true, createdAt: true } }),
    ]);
    res.json({ recentPatients, recentAppointments, recentRegistrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
