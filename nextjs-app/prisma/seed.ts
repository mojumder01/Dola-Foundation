import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@dolafoundation.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@dolafoundation.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Admin user created:", admin.email);

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      heroTitle: "Empowering Lives, Inspiring Hope",
      heroSubtitle:
        "We work to uplift communities through education, healthcare, and sustainable development across Bangladesh.",
      stat1Label: "Lives Impacted",
      stat1Value: "5000",
      stat2Label: "Active Programs",
      stat2Value: "12",
      stat3Label: "Districts Reached",
      stat3Value: "8",
      stat4Label: "Volunteers",
      stat4Value: "500",
    },
  });

  console.log("Site settings initialized.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
