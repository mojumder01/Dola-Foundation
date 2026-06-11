"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { createUser, updateUser, deleteUser } from "@/actions/admin/users";
import { formatDate } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

const roleVariant: Record<string, any> = {
  SUPER_ADMIN: "rejected",
  ADMIN: "approved",
  EDITOR: "pending",
};

export default function UsersManager({ users }: { users: User[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  function openNew() {
    setEditingUser(null);
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setFormError(null);
    setShowModal(true);
  }

  function handleDelete(user: User) {
    if (
      !confirm(
        `Delete user "${user.name}" (${user.email})? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (!result.success) {
        alert((result as any).error || "Failed to delete user.");
        return;
      }
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setFormError(null);
    startTransition(async () => {
      const result = editingUser
        ? await updateUser(editingUser.id, fd)
        : await createUser(fd);
      if (!result.success) {
        setFormError((result as any).error || "Failed to save.");
        return;
      }
      router.refresh();
      setShowModal(false);
      setEditingUser(null);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">
            Admin Users
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage who can access the admin panel
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-dark">All Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Created
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-dark">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={roleVariant[user.role] ?? "default"}>
                      {user.role.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                {formError}
              </div>
            )}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={editingUser?.name ?? ""}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={editingUser?.email ?? ""}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">
                {editingUser ? "New Password (leave blank to keep current)" : "Password *"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required={!editingUser}
                placeholder={
                  editingUser ? "Leave blank to keep current" : "Min 6 characters"
                }
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                defaultValue={editingUser?.role ?? "ADMIN"}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="EDITOR">Editor — can edit content</option>
                <option value="ADMIN">Admin — full access</option>
                <option value="SUPER_ADMIN">Super Admin — manage users</option>
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingUser ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
