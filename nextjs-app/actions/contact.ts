"use server";

import { prisma } from "@/lib/prisma";
import { sendContactConfirmation, sendContactNotification } from "@/lib/resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const validated = contactSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Please check your input",
      };
    }

    const contact = await prisma.contact.create({
      data: validated.data,
    });

    Promise.all([
      sendContactConfirmation({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
      }),
      sendContactNotification({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
      }),
    ]).catch(console.error);

    return { success: true, id: contact.id };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function getContacts(unreadOnly = false) {
  try {
    const contacts = await prisma.contact.findMany({
      where: unreadOnly ? { isRead: false } : {},
      orderBy: { createdAt: "desc" },
    });
    return { success: true, contacts };
  } catch (error) {
    return { success: false, contacts: [] };
  }
}

export async function markContactRead(id: string) {
  try {
    await prisma.contact.update({ where: { id }, data: { isRead: true } });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
