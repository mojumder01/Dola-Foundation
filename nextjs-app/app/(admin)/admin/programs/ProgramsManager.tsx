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
import { Layers, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/actions/admin/programs";
import { formatDate } from "@/lib/utils";

type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  objectives: string[];
  stat1Label: string | null;
  stat1Value: string | null;
  stat2Label: string | null;
  stat2Value: string | null;
  stat3Label: string | null;
  stat3Value: string | null;
  published: boolean;
  order: number;
  createdAt: Date;
};

export default function ProgramsManager({ programs }: { programs: Program[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const publishedRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditingProgram(null);
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(program: Program) {
    setEditingProgram(program);
    setFormError(null);
    setShowModal(true);
  }

  function handleDelete(program: Program) {
    if (
      !confirm(
        `Are you sure you want to delete "${program.title}"? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteProgram(program.id);
      if (!result.success) {
        alert("Failed to delete program. Check if the database is connected.");
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
      if (editingProgram) {
        result = await updateProgram(editingProgram.id, fd);
      } else {
        result = await createProgram(fd);
      }
      if (!result.success) {
        setFormError((result as any).error || "Failed to save. Is the database connected?");
        return;
      }
      router.refresh();
      setShowModal(false);
      setEditingProgram(null);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">
            Programs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage foundation programs
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-dark">
            All Programs ({programs.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  #
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Icon
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Slug
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Created
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {programs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-gray-400"
                  >
                    No programs yet. Create your first program!
                  </td>
                </tr>
              ) : (
                programs.map((program, index) => (
                  <tr key={program.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                    <td className="py-3 px-4 text-xl">
                      {program.icon || "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-dark">
                      {program.title}
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                      {program.slug}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {formatDate(program.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={program.published ? "approved" : "pending"}
                      >
                        {program.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(program)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(program)}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
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
              {editingProgram ? "Edit Program" : "New Program"}
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
                defaultValue={editingProgram?.title || ""}
                placeholder="Program title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={3}
                defaultValue={editingProgram?.description || ""}
                placeholder="Describe this program..."
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon (emoji)</Label>
              <Input
                id="icon"
                name="icon"
                defaultValue={editingProgram?.icon || ""}
                placeholder="e.g. 📚"
              />
            </div>
            <div>
              <Label htmlFor="objectives">Objectives (one per line)</Label>
              <Textarea
                id="objectives"
                name="objectives"
                rows={4}
                defaultValue={editingProgram?.objectives?.join("\n") || ""}
                placeholder={"Establish free learning centers\nProvide school supplies\nTrain local teachers"}
              />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Program Stats (shown on program page)</p>
                <p className="text-xs text-gray-400 mb-3">
                  These appear as highlight numbers on the program detail page.<br/>
                  <strong>Value</strong>: the number (e.g. <code className="bg-gray-100 px-1 rounded">2,000+</code>) &nbsp;|&nbsp;
                  <strong>Label</strong>: the text below it (e.g. <code className="bg-gray-100 px-1 rounded">Students Enrolled</code>)
                </p>
              </div>
              {[
                { i: 1, valueEx: "2,000+", labelEx: "Students Enrolled" },
                { i: 2, valueEx: "15", labelEx: "Learning Centers" },
                { i: 3, valueEx: "5", labelEx: "Districts Covered" },
              ].map(({ i, valueEx, labelEx }) => (
                <div key={i} className="grid grid-cols-2 gap-2 bg-[#F8FAFC] rounded-xl p-3">
                  <div>
                    <Label htmlFor={`stat${i}Value`} className="text-xs">Stat {i} — Value</Label>
                    <Input id={`stat${i}Value`} name={`stat${i}Value`} defaultValue={(editingProgram as any)?.[`stat${i}Value`] || ""} placeholder={valueEx} />
                    <p className="text-xs text-gray-400 mt-0.5">e.g. {valueEx}</p>
                  </div>
                  <div>
                    <Label htmlFor={`stat${i}Label`} className="text-xs">Stat {i} — Label</Label>
                    <Input id={`stat${i}Label`} name={`stat${i}Label`} defaultValue={(editingProgram as any)?.[`stat${i}Label`] || ""} placeholder={labelEx} />
                    <p className="text-xs text-gray-400 mt-0.5">e.g. {labelEx}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={publishedRef}
                type="checkbox"
                id="published"
                name="published"
                defaultChecked={editingProgram?.published ?? true}
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
                ) : editingProgram ? (
                  "Update Program"
                ) : (
                  "Create Program"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
