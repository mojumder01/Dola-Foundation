import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Layers, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getPrograms() {
  try {
    return await prisma.program.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

const staticPrograms = [
  { id: "1", title: "Education", slug: "education", published: true, order: 1, createdAt: new Date() },
  { id: "2", title: "Healthcare", slug: "healthcare", published: true, order: 2, createdAt: new Date() },
  { id: "3", title: "Charity & Relief", slug: "charity-relief", published: true, order: 3, createdAt: new Date() },
  { id: "4", title: "Environment", slug: "environment", published: true, order: 4, createdAt: new Date() },
  { id: "5", title: "Youth Development", slug: "youth-development", published: true, order: 5, createdAt: new Date() },
  { id: "6", title: "Orphan Care", slug: "orphan-care", published: true, order: 6, createdAt: new Date() },
];

export default async function AdminProgramsPage() {
  let programs = await getPrograms();
  if (programs.length === 0) programs = staticPrograms as any;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Programs</h1>
          <p className="text-gray-500 text-sm mt-1">Manage foundation programs</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Layers className="w-5 h-5 text-[#0F3D8C]" />
          <h2 className="font-semibold text-[#1A1A2E]">All Programs ({programs.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">#</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Slug</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {programs.map((program, index) => (
                <tr key={program.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-[#1A1A2E]">{program.title}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{program.slug}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(program.createdAt)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={program.published ? "approved" : "pending"}>
                      {program.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#0F3D8C] hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors" title="Toggle visibility">
                        {program.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
    </div>
  );
}
