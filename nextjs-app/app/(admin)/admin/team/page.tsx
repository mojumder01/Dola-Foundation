import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getTeamMembers() {
  try {
    return await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your team profiles</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No team members added yet.</p>
          <Button variant="primary" size="sm" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl shadow-card p-5 text-center group">
              <div className="w-16 h-16 bg-[#0F3D8C] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  member.name[0]
                )}
              </div>
              <p className="font-semibold text-[#1A1A2E]">{member.name}</p>
              <p className="text-[#0F3D8C] text-xs mt-0.5">{member.role}</p>
              <Badge variant={member.active ? "approved" : "pending"} className="mt-2">
                {member.active ? "Active" : "Inactive"}
              </Badge>
              <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-gray-400 hover:text-[#0F3D8C] hover:bg-blue-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
