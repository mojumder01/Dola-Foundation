import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Globe, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

const statusVariant: Record<string, any> = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  UPCOMING: "upcoming",
};

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage foundation projects</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#0F3D8C]" />
          <h2 className="font-semibold text-[#1A1A2E]">All Projects ({projects.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Visibility</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No projects yet. Create your first project!
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#1A1A2E]">{project.title}</p>
                      <p className="text-xs text-gray-400">/projects/{project.slug}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{project.location || "—"}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={project.published ? "approved" : "pending"}>
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(project.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-[#0F3D8C] hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}
