import { prisma } from "@/lib/prisma";
import TeamManager from "./TeamManager";

async function getTeamMembers() {
  try {
    return await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  return <TeamManager members={members} />;
}
