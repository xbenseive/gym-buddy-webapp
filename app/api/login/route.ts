import { NextResponse } from "next/server";

type LoginRequestBody = {
  username: string;
  password: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as LoginRequestBody;

  if (body.username === "admin" && body.password === "123") {
    const res = NextResponse.json({ success: true, status: 200 });
    res.cookies.set("token", "123", {
      httpOnly: true,
      maxAge: 60 * 60,
    });
    return res;
  }

  return NextResponse.json({ success: false, status: 401 });
}
