"use client";

import { useState, useTransition, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/actions/admin/team";

type Member = {
  id: string;
  name: string;
  nameBn?: string | null;
  role: string;
  roleBn?: string | null;
  bio: string | null;
  bioBn?: string | null;
  image: string | null;
  active: boolean;
  order: number;
};

export default function TeamManager({ members }: { members: Member[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const activeRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditingMember(null);
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(member: Member) {
    setEditingMember(member);
    setFormError(null);
    setShowModal(true);
  }

  function handleDelete(member: Member) {
    if (
      !confirm(
        `Are you sure you want to delete "${member.name}"? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteTeamMember(member.id);
      if (!result.success) {
        alert("Failed to delete member. Check if the database is connected.");
        return;
      }
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("active", activeRef.current?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      let result;
      if (editingMember) {
        result = await updateTeamMember(editingMember.id, fd);
      } else {
        result = await createTeamMember(fd);
      }
      if (!result.success) {
        setFormError((result as any).error || "Failed to save. Is the database connected?");
        return;
      }
      router.refresh();
      setShowModal(false);
      setEditingMember(null);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">
            Team Members
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your team profiles
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No team members added yet.</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={openNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-card p-5 text-center group"
            >
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  member.name[0]
                )}
              </div>
              <p className="font-semibold text-dark">{member.name}</p>
              <p className="text-primary text-xs mt-0.5">{member.role}</p>
              <Badge
                variant={member.active ? "approved" : "pending"}
                className="mt-2"
              >
                {member.active ? "Active" : "Inactive"}
              </Badge>
              <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(member)}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  disabled={isPending}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Member" : "New Member"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                {formError}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Name * <span className="text-gray-400 font-normal">(English)</span></Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={editingMember?.name || ""}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="nameBn">Name <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                <Input
                  id="nameBn"
                  name="nameBn"
                  defaultValue={editingMember?.nameBn || ""}
                  placeholder="বাংলায় লিখুন"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="role">Role * <span className="text-gray-400 font-normal">(English)</span></Label>
                <Input
                  id="role"
                  name="role"
                  required
                  defaultValue={editingMember?.role || ""}
                  placeholder="e.g. Executive Director"
                />
              </div>
              <div>
                <Label htmlFor="roleBn">Role <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                <Input
                  id="roleBn"
                  name="roleBn"
                  defaultValue={editingMember?.roleBn || ""}
                  placeholder="বাংলায় লিখুন"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="bio">Bio <span className="text-gray-400 font-normal">(English)</span></Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  defaultValue={editingMember?.bio || ""}
                  placeholder="Short biography..."
                />
              </div>
              <div>
                <Label htmlFor="bioBn">Bio <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                <Textarea
                  id="bioBn"
                  name="bioBn"
                  rows={3}
                  defaultValue={editingMember?.bioBn || ""}
                  placeholder="বাংলায় লিখুন"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                defaultValue={editingMember?.image || ""}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={activeRef}
                type="checkbox"
                id="active"
                name="active"
                defaultChecked={editingMember?.active ?? true}
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active
              </Label>
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
                ) : editingMember ? (
                  "Update Member"
                ) : (
                  "Add Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
