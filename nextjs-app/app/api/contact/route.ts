import { NextRequest, NextResponse } from "next/server";
import { submitContact } from "@/actions/contact";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    const result = await submitContact(formData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
