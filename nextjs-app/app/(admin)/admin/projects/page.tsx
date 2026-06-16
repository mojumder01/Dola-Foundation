import { prisma } from "@/lib/prisma";
import ProjectsManager from "./ProjectsManager";

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

async function getGalleryImages() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminProjectsPage() {
  const [projects, galleryImages] = await Promise.all([getProjects(), getGalleryImages()]);
  return <ProjectsManager projects={projects} galleryImages={galleryImages} />;
}
