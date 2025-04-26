import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return new Response("Invalid credentials", { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return new Response("Invalid credentials", { status: 401 });

  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  const res = new NextResponse(JSON.stringify({ message: "Logged in" }), {
    status: 200,
  });
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
