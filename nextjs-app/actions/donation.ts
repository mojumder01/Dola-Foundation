"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const donationSchema = z.object({
  donorName: z.string().min(2),
  donorEmail: z.string().email(),
  donorPhone: z.string().optional(),
  amount: z.number().min(100),
  currency: z.string().default("BDT"),
  method: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "STRIPE", "PAYPAL"]),
  transactionId: z.string().optional(),
  programId: z.string().optional(),
  isRecurring: z.boolean().default(false),
  frequency: z.string().optional(),
  message: z.string().optional(),
});

export async function recordDonation(formData: FormData) {
  try {
    const rawData = {
      donorName: formData.get("donorName") as string,
      donorEmail: formData.get("donorEmail") as string,
      donorPhone: (formData.get("donorPhone") as string) || undefined,
      amount: Number(formData.get("amount")),
      currency: "BDT",
      method: formData.get("method") as string,
      transactionId: (formData.get("transactionId") as string) || undefined,
      programId: (formData.get("programId") as string) || undefined,
      isRecurring: formData.get("isRecurring") === "true",
      frequency: (formData.get("frequency") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
    };

    const validated = donationSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid donation data",
      };
    }

    // Resolve programId from slug to actual DB id
    let resolvedProgramId: string | null = null;
    if (validated.data.programId) {
      try {
        // Try to find program by slug first, then by id
        const program = await prisma.program.findFirst({
          where: {
            OR: [
              { slug: validated.data.programId },
              { id: validated.data.programId },
            ],
          },
          select: { id: true },
        });
        resolvedProgramId = program?.id ?? null;
      } catch {
        resolvedProgramId = null;
      }
    }

    // Find or create donor
    let donor = await prisma.donor.findUnique({
      where: { email: validated.data.donorEmail },
    });

    if (!donor) {
      donor = await prisma.donor.create({
        data: {
          name: validated.data.donorName,
          email: validated.data.donorEmail,
          phone: validated.data.donorPhone,
          totalGiven: validated.data.amount,
        },
      });
    } else {
      await prisma.donor.update({
        where: { id: donor.id },
        data: {
          totalGiven: {
            increment: validated.data.amount,
          },
        },
      });
    }

    const { programId: _programId, ...donationData } = validated.data;
    const donation = await prisma.donation.create({
      data: {
        ...donationData,
        donorId: donor.id,
        programId: resolvedProgramId,
        status: "PENDING",
      },
    });

    return { success: true, id: donation.id };
  } catch (error) {
    console.error("Donation error:", error);
    return { success: false, error: "Failed to record donation. Please try again." };
  }
}

export async function getDonations() {
  try {
    const donations = await prisma.donation.findMany({
      include: { program: true, donor: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, donations };
  } catch (error) {
    return { success: false, donations: [] };
  }
}

export async function getDonationStats() {
  try {
    const [total, count, recentDonations] = await Promise.all([
      prisma.donation.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.donation.count(),
      prisma.donation.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { program: true },
      }),
    ]);

    return {
      success: true,
      totalAmount: total._sum.amount || 0,
      totalCount: count,
      recentDonations,
    };
  } catch (error) {
    return { success: false, totalAmount: 0, totalCount: 0, recentDonations: [] };
  }
}
