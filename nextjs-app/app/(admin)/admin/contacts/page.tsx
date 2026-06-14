import { prisma } from "@/lib/prisma";
import ContactsManager from "./ContactsManager";

async function getContacts() {
  try {
    return await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminContactsPage() {
  const contacts = await getContacts();
  return <ContactsManager contacts={contacts} />;
}
