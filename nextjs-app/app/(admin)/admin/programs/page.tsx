import { prisma } from "@/lib/prisma";
import ProgramsManager from "./ProgramsManager";

async function getPrograms() {
  try {
    return await prisma.program.findMany({ orderBy: { order: "asc" } });
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

export default async function AdminProgramsPage() {
  const [programs, galleryImages] = await Promise.all([getPrograms(), getGalleryImages()]);
  return <ProgramsManager programs={programs} galleryImages={galleryImages} />;
}
