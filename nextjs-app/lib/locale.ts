import { cookies } from "next/headers";

export type Locale = "en" | "bn";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === "bn" ? "bn" : "en";
}

export function pickLocale(
  en: string | null | undefined,
  bn: string | null | undefined,
  locale: Locale
): string {
  if (locale === "bn" && bn && bn.trim().length > 0) return bn;
  return en || "";
}
