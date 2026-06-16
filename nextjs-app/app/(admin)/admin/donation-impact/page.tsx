import { prisma } from "@/lib/prisma";
import DonationImpactManager from "./DonationImpactManager";

async function getImpacts() {
  try {
    return await prisma.donationImpact.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

export default async function DonationImpactPage() {
  const impacts = await getImpacts();
  return <DonationImpactManager impacts={impacts} />;
}
