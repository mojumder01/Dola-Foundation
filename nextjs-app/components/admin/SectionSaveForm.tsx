"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionField = {
  name: string;
  label: string;
  type?: "input" | "textarea";
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  hint?: string;
};

export default function SectionSaveForm({
  title,
  description,
  fields,
  action,
  icon,
}: {
  title: string;
  description?: string;
  fields: SectionField[];
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  icon?: React.ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await action(fd);
    setPending(false);
    if (result?.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result?.error || "Failed to save");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-card p-6"
    >
      <div className="flex items-center justify-between gap-3 mb-1 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-poppins font-semibold text-lg text-dark">{title}</h2>
        </div>
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
      {description && <p className="text-xs text-gray-500 mb-4 mt-2">{description}</p>}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm mb-4">
          {error}
        </div>
      )}
      <div className={cn("space-y-4", !description && "mt-4")}>
        {fields.map((field) => (
          <div key={field.name}>
            <Label className="label-base" htmlFor={field.name}>
              {field.label}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                name={field.name}
                defaultValue={field.defaultValue}
                placeholder={field.placeholder}
                rows={field.rows ?? 3}
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                defaultValue={field.defaultValue}
                placeholder={field.placeholder}
              />
            )}
            {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
          </div>
        ))}
      </div>
    </form>
  );
}
