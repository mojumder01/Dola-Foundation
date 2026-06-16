"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { createFAQ, updateFAQ, deleteFAQ } from "@/actions/admin/faq";
import { formatDate } from "@/lib/utils";

type FAQ = {
  id: string;
  question: string;
  questionBn?: string | null;
  answer: string;
  answerBn?: string | null;
  category: string | null;
  categoryBn?: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
};

export default function FAQManager({ faqs }: { faqs: FAQ[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const activeRef = useRef<HTMLInputElement>(null);

  function openNew() { setEditing(null); setFormError(null); setShowModal(true); }
  function openEdit(faq: FAQ) { setEditing(faq); setFormError(null); setShowModal(true); }

  function handleDelete(faq: FAQ) {
    if (!confirm(`Delete "${faq.question}"?`)) return;
    startTransition(async () => {
      const result = await deleteFAQ(faq.id);
      if (!result.success) { alert("Failed to delete"); return; }
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("active", activeRef.current?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      const result = editing ? await updateFAQ(editing.id, fd) : await createFAQ(fd);
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
          <h1 className="font-poppins font-bold text-2xl text-dark">FAQ</h1>
          <p className="text-gray-500 text-sm mt-1">Manage frequently asked questions</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-dark">All FAQs ({faqs.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {faqs.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No FAQs yet. Add your first FAQ!</div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="p-5 hover:bg-gray-50/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${faq.active ? "bg-green-500" : "bg-gray-300"}`} />
                      {faq.category && <Badge variant="pending" className="text-xs">{faq.category}</Badge>}
                      <span className="text-xs text-gray-400">Order: {faq.order}</span>
                    </div>
                    <p className="font-semibold text-dark text-sm">{faq.question}</p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{faq.answer}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(faq.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(faq)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(faq)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">{formError}</div>}
            <div>
              <Label htmlFor="question">Question * <span className="text-gray-400 font-normal">(English)</span></Label>
              <Input id="question" name="question" required defaultValue={editing?.question || ""} placeholder="e.g. How can I donate?" />
            </div>
            <div>
              <Label htmlFor="questionBn">Question <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
              <Input id="questionBn" name="questionBn" defaultValue={editing?.questionBn || ""} placeholder="বাংলায় লিখুন" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="answer">Answer * <span className="text-gray-400 font-normal">(English)</span></Label>
                <Textarea id="answer" name="answer" required rows={5} defaultValue={editing?.answer || ""} placeholder="Detailed answer... (HTML supported)" />
              </div>
              <div>
                <Label htmlFor="answerBn">Answer <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                <Textarea id="answerBn" name="answerBn" rows={5} defaultValue={editing?.answerBn || ""} placeholder="বাংলায় লিখুন" />
              </div>
            </div>
            <p className="text-xs text-gray-400 -mt-2">You can use HTML tags like &lt;b&gt;, &lt;a&gt;, &lt;br&gt; for formatting</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="category">Category (optional) <span className="text-gray-400 font-normal">(English)</span></Label>
                <Input id="category" name="category" defaultValue={editing?.category || ""} placeholder="e.g. Donation, Volunteer" />
              </div>
              <div>
                <Label htmlFor="categoryBn">Category <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                <Input id="categoryBn" name="categoryBn" defaultValue={editing?.categoryBn || ""} placeholder="বাংলায় লিখুন" />
              </div>
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" name="order" type="number" defaultValue={editing?.order ?? 0} />
            </div>
            <div className="flex items-center gap-2">
              <input ref={activeRef} type="checkbox" id="active" name="active" defaultChecked={editing?.active ?? true} className="w-4 h-4 rounded" />
              <Label htmlFor="active" className="cursor-pointer">Active (visible on site)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : editing ? "Update FAQ" : "Create FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
