import { prisma } from "../db.js";
import type { Prisma } from "@prisma/client";

export type ActivityType =
  | "REGISTRATION_SUBMITTED"
  | "REGISTRATION_APPROVED"
  | "PROVIDER_ASSIGNED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_CONFIRMED"
  | "APPOINTMENT_RESCHEDULED"
  | "APPOINTMENT_CANCELLED"
  | "APPOINTMENT_COMPLETED";

interface LogActivityInput {
  type: ActivityType;
  message: string;
  userId?: string | null;
  patientId?: string | null;
  metadata?: Prisma.InputJsonValue;
}

/**
 * Append one entry to a client's activity feed. Best-effort: any failure is
 * swallowed so logging never breaks the request that triggered it.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        type: input.type,
        message: input.message,
        userId: input.userId ?? null,
        patientId: input.patientId ?? null,
        metadata: input.metadata,
      },
    });
  } catch (err) {
    console.error("logActivity failed:", (err as Error).message);
  }
}
