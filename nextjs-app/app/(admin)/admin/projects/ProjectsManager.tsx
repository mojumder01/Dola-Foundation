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
import { Globe, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/actions/admin/projects";
import { formatDate } from "@/lib/utils";

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  status: string;
  published: boolean;
  createdAt: Date;
};

const statusVariant: Record<string, any> = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  UPCOMING: "upcoming",
};

export default function ProjectsManager({
  projects,
}: {
  projects: Project[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const publishedRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditingProject(null);
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setFormError(null);
    setShowModal(true);
  }

  function handleDelete(project: Project) {
    if (
      !confirm(
        `Are you sure you want to delete "${project.title}"? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (!result.success) {
        alert("Failed to delete project. Check if the database is connected.");
        return;
      }
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("published", publishedRef.current?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      let result;
      if (editingProject) {
        result = await updateProject(editingProject.id, fd);
      } else {
        result = await createProject(fd);
      }
      if (!result.success) {
        setFormError((result as any).error || "Failed to save. Is the database connected?");
        return;
      }
      router.refresh();
      setShowModal(false);
      setEditingProject(null);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">
            Projects
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage foundation projects
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-dark">
            All Projects ({projects.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Visibility
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
              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-400"
                  >
                    No projects yet. Create your first project!
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-dark">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        /projects/{project.slug}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {project.location || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[project.status]}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={project.published ? "approved" : "pending"}
                      >
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(project)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "New Project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                {formError}
              </div>
            )}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={editingProject?.title || ""}
                placeholder="Project title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={3}
                defaultValue={editingProject?.description || ""}
                placeholder="Describe this project..."
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={editingProject?.location || ""}
                placeholder="e.g. Nairobi, Kenya"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={editingProject?.status || "ONGOING"}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="UPCOMING">Upcoming</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={publishedRef}
                type="checkbox"
                id="published"
                name="published"
                defaultChecked={editingProject?.published ?? true}
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Published
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
                ) : editingProject ? (
                  "Update Project"
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
