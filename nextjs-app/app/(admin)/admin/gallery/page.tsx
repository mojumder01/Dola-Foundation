import { prisma } from "@/lib/prisma";
import GalleryManager from "./GalleryManager";

async function getImages() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminGalleryPage() {
  const images = await getImages();
  return <GalleryManager images={images} />;
}
