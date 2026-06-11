import { prisma } from "@/lib/prisma";
import TestimonialsManager from "./TestimonialsManager";

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsManager testimonials={testimonials} />;
}
