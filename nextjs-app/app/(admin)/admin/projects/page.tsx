import { prisma } from "@/lib/prisma";
import ProjectsManager from "./ProjectsManager";

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsManager projects={projects} />;
}
