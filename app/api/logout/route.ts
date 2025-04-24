import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", { maxAge: 0 });
  return res;
}
