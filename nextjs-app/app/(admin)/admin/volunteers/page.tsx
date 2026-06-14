import { prisma } from "@/lib/prisma";
import VolunteersManager from "./VolunteersManager";

async function getVolunteers() {
  try {
    return await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminVolunteersPage() {
  const volunteers = await getVolunteers();
  return <VolunteersManager volunteers={volunteers} />;
}
