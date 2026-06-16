"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, Edit, Trash2, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { createDonationImpact, updateDonationImpact, deleteDonationImpact, toggleDonationImpact } from "@/actions/admin/donation-impact";

type DonationImpact = {
  id: string;
  icon: string;
  amount: number;
  impact: string;
  impactBn?: string | null;
  active: boolean;
  order: number;
};

export default function DonationImpactManager({ impacts }: { impacts: DonationImpact[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DonationImpact | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const activeRef = useRef<HTMLInputElement>(null);

  function openNew() { setEditing(null); setFormError(null); setShowModal(true); }
  function openEdit(i: DonationImpact) { setEditing(i); setFormError(null); setShowModal(true); }

  function handleDelete(i: DonationImpact) {
    if (!confirm(`Delete "৳${i.amount.toLocaleString()} — ${i.impact}"?`)) return;
    startTransition(async () => {
      await deleteDonationImpact(i.id);
      router.refresh();
    });
  }

  function handleToggle(i: DonationImpact) {
    startTransition(async () => {
      await toggleDonationImpact(i.id, !i.active);
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("active", activeRef.current?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      const result = editing ? await updateDonationImpact(editing.id, fd) : await createDonationImpact(fd);
      if (!result.success) { setFormError((result as any).error || "Failed to save"); return; }
      router.refresh();
      setShowModal(false);
      setEditing(null);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">Donation Impact Amounts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the "See Your Impact" amount cards shown on the donate page</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Amount
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Gift className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-dark">All Impact Amounts ({impacts.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {impacts.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No impact amounts yet. Add your first one!</div>
          ) : (
            impacts.map((i) => (
              <div key={i.id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50/50">
                <div className="flex-1 min-w-0 flex items-start gap-3">
                  <div className="text-3xl">{i.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={i.active ? "approved" : "pending"}>{i.active ? "Active" : "Disabled"}</Badge>
                      <span className="font-poppins font-bold text-primary">৳{i.amount.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">Order: {i.order}</span>
                    </div>
                    <p className="text-sm text-gray-500">{i.impact}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(i)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-primary rounded-lg transition-colors" title={i.active ? "Disable" : "Enable"}>
                    {i.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => openEdit(i)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(i)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Impact Amount" : "New Impact Amount"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">{formError}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input id="icon" name="icon" defaultValue={editing?.icon || "💝"} placeholder="🍱" />
              </div>
              <div>
                <Label htmlFor="amount">Amount (৳) *</Label>
                <Input id="amount" name="amount" type="number" required min="1" defaultValue={editing?.amount ?? ""} placeholder="500" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="impact">Impact Description * <span className="text-gray-400 font-normal">(English)</span></Label>
                <Textarea id="impact" name="impact" required rows={2} defaultValue={editing?.impact || ""} placeholder="e.g. Feeds a family of 5 for a week" />
              </div>
              <div>
                <Label htmlFor="impactBn">Impact Description <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                <Textarea id="impactBn" name="impactBn" rows={2} defaultValue={editing?.impactBn || ""} placeholder="বাংলায় লিখুন" />
              </div>
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" name="order" type="number" defaultValue={editing?.order ?? 0} />
            </div>
            <div className="flex items-center gap-2">
              <input ref={activeRef} type="checkbox" id="active" name="active" defaultChecked={editing?.active ?? true} className="w-4 h-4 rounded" />
              <Label htmlFor="active" className="cursor-pointer">Active (visible on donate page)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
