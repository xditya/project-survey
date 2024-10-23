import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const hasSubmitted = cookieStore.get("hasSubmitted");

  return NextResponse.json({ hasSubmitted: !!hasSubmitted });
}
