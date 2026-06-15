import { prisma } from "@/lib/prisma";
import FAQManager from "./FAQManager";

async function getFAQs() {
  try {
    return await prisma.fAQ.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs();
  return <FAQManager faqs={faqs} />;
}
