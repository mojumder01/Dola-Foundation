import { prisma } from "@/lib/prisma";
import ProgramsManager from "./ProgramsManager";

async function getPrograms() {
  try {
    return await prisma.program.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminProgramsPage() {
  const programs = await getPrograms();
  return <ProgramsManager programs={programs} />;
}
