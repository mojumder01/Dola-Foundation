import { prisma } from "@/lib/prisma";
import UsersManager from "./UsersManager";

async function getUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  return <UsersManager users={users} />;
}
