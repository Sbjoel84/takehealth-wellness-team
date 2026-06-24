import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [providers, total] = await Promise.all([
      prisma.healthServiceProvider.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.healthServiceProvider.count({ where }),
    ]);

    res.json({ data: providers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await prisma.healthServiceProvider.findUnique({ where: { id: req.params.id } });
    if (!provider) { res.status(404).json({ message: "Provider not found" }); return; }
    res.json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, type, specialty, location, status } = req.body;
    if (!name || !type) { res.status(400).json({ message: "Name and type are required" }); return; }

    const provider = await prisma.healthServiceProvider.create({
      data: { name, email: email || null, phone: phone || null, type, specialty: specialty || null, location: location || null, status: status || "ACTIVE" },
    });
    res.status(201).json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await prisma.healthServiceProvider.findUnique({ where: { id: req.params.id } });
    if (!provider) { res.status(404).json({ message: "Provider not found" }); return; }
    const updated = await prisma.healthServiceProvider.update({ where: { id: req.params.id }, data: req.body });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await prisma.healthServiceProvider.findUnique({ where: { id: req.params.id } });
    if (!provider) { res.status(404).json({ message: "Provider not found" }); return; }
    await prisma.healthServiceProvider.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
