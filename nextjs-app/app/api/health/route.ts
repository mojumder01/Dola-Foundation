import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.database_url = process.env.DATABASE_URL
    ? "set"
    : "MISSING";
  checks.auth_secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    ? "set"
    : "MISSING";
  checks.node_env = process.env.NODE_ENV ?? "unknown";

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db_connection = "ok";
  } catch (err: any) {
    checks.db_connection = `error: ${err?.message ?? String(err)}`;
  }

  const ok = checks.db_connection === "ok" && checks.database_url === "set";
  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 500 });
}
