import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { auth } from "../src/auth.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@takehealthglobal.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "TakeHealth@Admin2024";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    await auth.api.signUpEmail({
      body: { name: "TakeHealth Admin", email: adminEmail, password: adminPassword },
    });
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN", emailVerified: true },
    });
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  const providers = [
    { name: "Lagos Fitness Centre", type: "GYM", specialty: "Fitness & Strength", location: "Victoria Island, Lagos", status: "ACTIVE" },
    { name: "Radiance Spa & Wellness", type: "SPA", specialty: "Massage & Relaxation", location: "Lekki, Lagos", status: "ACTIVE" },
    { name: "DentaCare Clinic", type: "DENTAL", specialty: "General & Cosmetic Dentistry", location: "Ikeja, Lagos", status: "ACTIVE" },
    { name: "NutriLife Consulting", type: "NUTRITION", specialty: "Diet & Nutrition Planning", location: "Yaba, Lagos", status: "ACTIVE" },
  ];

  for (const p of providers) {
    const exists = await prisma.healthServiceProvider.findFirst({ where: { name: p.name } });
    if (!exists) {
      await prisma.healthServiceProvider.create({ data: p });
      console.log(`Provider created: ${p.name}`);
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
