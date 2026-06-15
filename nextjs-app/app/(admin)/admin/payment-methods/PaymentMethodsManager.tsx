"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Edit, Trash2, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { createPaymentMethod, updatePaymentMethod, deletePaymentMethod, togglePaymentMethod } from "@/actions/admin/payment-methods";
import { formatDate } from "@/lib/utils";

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
  accountInfo: string | null;
  instructions: string | null;
  active: boolean;
  order: number;
  createdAt: Date;
};

const PAYMENT_TYPES = ["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "STRIPE", "PAYPAL", "OTHER"];

export default function PaymentMethodsManager({ methods }: { methods: PaymentMethod[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [showAccount, setShowAccount] = useState(false);
  const router = useRouter();
  const activeRef = useRef<HTMLInputElement>(null);

  function openNew() { setEditing(null); setFormError(null); setShowAccount(false); setShowModal(true); }
  function openEdit(m: PaymentMethod) { setEditing(m); setFormError(null); setShowAccount(false); setShowModal(true); }

  function handleDelete(m: PaymentMethod) {
    if (!confirm(`Delete "${m.name}"?`)) return;
    startTransition(async () => {
      await deletePaymentMethod(m.id);
      router.refresh();
    });
  }

  function handleToggle(m: PaymentMethod) {
    startTransition(async () => {
      await togglePaymentMethod(m.id, !m.active);
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("active", activeRef.current?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      const result = editing ? await updatePaymentMethod(editing.id, fd) : await createPaymentMethod(fd);
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
          <h1 className="font-poppins font-bold text-2xl text-dark">Payment Methods</h1>
          <p className="text-gray-500 text-sm mt-1">Manage donation payment options shown on the donate page</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Method
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <strong>Security note:</strong> Account numbers are masked by default in the list view. Only you can see them when editing. Never share admin access with untrusted users.
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-dark">All Payment Methods ({methods.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {methods.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No payment methods yet. Add your first one!</div>
          ) : (
            methods.map((m) => (
              <div key={m.id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={m.active ? "approved" : "pending"}>{m.active ? "Active" : "Disabled"}</Badge>
                    <span className="font-semibold text-dark">{m.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{m.type}</span>
                    <span className="text-xs text-gray-400">Order: {m.order}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Account: {m.accountInfo ? "••••••••" : <span className="text-gray-300 italic">Not set</span>}
                  </p>
                  {m.instructions && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{m.instructions}</p>}
                  <p className="text-xs text-gray-400 mt-1">{formatDate(m.createdAt)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(m)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-primary rounded-lg transition-colors" title={m.active ? "Disable" : "Enable"}>
                    {m.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(m)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
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
            <DialogTitle>{editing ? "Edit Payment Method" : "New Payment Method"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">{formError}</div>}
            <div>
              <Label htmlFor="name">Display Name *</Label>
              <Input id="name" name="name" required defaultValue={editing?.name || ""} placeholder="e.g. bKash, Bank Transfer" />
            </div>
            <div>
              <Label htmlFor="type">Payment Type *</Label>
              <select id="type" name="type" defaultValue={editing?.type || "BKASH"} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                {PAYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="accountInfo">Account Number / Info</Label>
                <button type="button" onClick={() => setShowAccount(!showAccount)} className="text-xs text-primary hover:underline">
                  {showAccount ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                id="accountInfo"
                name="accountInfo"
                type={showAccount ? "text" : "password"}
                defaultValue={editing?.accountInfo || ""}
                placeholder="e.g. 01XXXXXXXXX (shown to donors)"
                autoComplete="off"
              />
              <p className="text-xs text-gray-400 mt-1">This will be shown to donors on the donate page. Keep it to account number only.</p>
            </div>
            <div>
              <Label htmlFor="instructions">Instructions (optional)</Label>
              <Textarea id="instructions" name="instructions" rows={3} defaultValue={editing?.instructions || ""} placeholder="e.g. Send to bKash Personal 01XXXXXXXX and include your name as reference." />
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
