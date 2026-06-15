import { prisma } from "@/lib/prisma";
import PagesManager from "./PagesManager";

async function getPages() {
  try {
    const pages = await prisma.pageContent.findMany();
    return Object.fromEntries(pages.map((p) => [p.slug, p]));
  } catch {
    return {};
  }
}

export default async function PagesAdminPage() {
  const pages = await getPages();
  return <PagesManager pages={pages} />;
}
