import { prisma } from "@/lib/prisma";
import VideosManager from "./VideosManager";

export default async function VideosPage() {
  let videos: any[] = [];
  try {
    videos = await prisma.video.findMany({ orderBy: { order: "asc" } });
  } catch {}

  return <VideosManager videos={videos} />;
}
