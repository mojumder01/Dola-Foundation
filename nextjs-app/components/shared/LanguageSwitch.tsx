"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { setLocaleAction } from "@/actions/locale";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locale";

export default function LanguageSwitch({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  function toggle() {
    const next: Locale = locale === "en" ? "bn" : "en";
    setPendingLocale(next);
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  const display = pendingLocale ?? locale;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label="Switch language"
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all disabled:opacity-60",
        className
      )}
    >
      <Languages className="w-3.5 h-3.5" />
      {display === "en" ? "বাংলা" : "English"}
    </button>
  );
}
