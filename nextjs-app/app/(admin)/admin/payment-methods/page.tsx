import { prisma } from "@/lib/prisma";
import PaymentMethodsManager from "./PaymentMethodsManager";

async function getMethods() {
  try {
    return await prisma.paymentMethodConfig.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

export default async function PaymentMethodsPage() {
  const methods = await getMethods();
  return <PaymentMethodsManager methods={methods} />;
}
