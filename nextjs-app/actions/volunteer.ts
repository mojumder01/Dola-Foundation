"use server";

import { prisma } from "@/lib/prisma";
import { sendVolunteerConfirmation, sendVolunteerNotification } from "@/lib/resend";
import { z } from "zod";

const volunteerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().optional(),
  profession: z.string().optional(),
  skills: z.array(z.string()).default([]),
  interest: z.array(z.string()).default([]),
  availability: z.string().optional(),
  message: z.string().optional(),
});

export async function submitVolunteer(formData: FormData) {
  try {
    const skills = JSON.parse((formData.get("skills") as string) || "[]");
    const interest = JSON.parse((formData.get("interest") as string) || "[]");

    const rawData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: (formData.get("address") as string) || undefined,
      profession: (formData.get("profession") as string) || undefined,
      skills,
      interest,
      availability: (formData.get("availability") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
    };

    const validated = volunteerSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid data",
      };
    }

    const volunteer = await prisma.volunteer.create({
      data: validated.data,
    });

    // Send emails (non-blocking)
    Promise.all([
      sendVolunteerConfirmation({
        name: volunteer.fullName,
        email: volunteer.email,
      }),
      sendVolunteerNotification({
        name: volunteer.fullName,
        email: volunteer.email,
        phone: volunteer.phone,
        profession: volunteer.profession || undefined,
      }),
    ]).catch(console.error);

    return { success: true, id: volunteer.id };
  } catch (error) {
    console.error("Failed to submit volunteer:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}

export async function updateVolunteerStatus(
  id: string,
  status: "APPROVED" | "REJECTED" | "ACTIVE",
  notes?: string
) {
  try {
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: { status, notes },
    });
    return { success: true, volunteer };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function getVolunteers(status?: string) {
  try {
    const volunteers = await prisma.volunteer.findMany({
      where: status && status !== "ALL" ? { status: status as any } : {},
      orderBy: { createdAt: "desc" },
    });
    return { success: true, volunteers };
  } catch (error) {
    return { success: false, volunteers: [] };
  }
}
