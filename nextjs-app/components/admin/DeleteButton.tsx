"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<any>;
  label?: string;
  className?: string;
}

export default function DeleteButton({ id, action, label, className }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Are you sure you want to delete this ${label || "item"}? This action cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      await action(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={className || "p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"}
      title={`Delete ${label || "item"}`}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
