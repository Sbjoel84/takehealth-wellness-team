import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: string };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.user = session.user as Request["user"];
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN" && role !== "STAFF_ADMIN") {
      res.status(403).json({ message: "Forbidden: admin access required" });
      return;
    }
    req.user = session.user as Request["user"];
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
