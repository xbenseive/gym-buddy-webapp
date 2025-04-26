import { generateToken } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password } = await req.json();
  const existing = await User.findOne({ email });
  if (existing) {
    return new Response("Email already exists", { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = generateToken({ id: user._id, email: user.email });
  const res = new NextResponse(
    JSON.stringify({ message: "Register successfully and LoggedIn" }),
    { status: 200 }
  );
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
