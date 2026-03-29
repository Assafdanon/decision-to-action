import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(request) {
  const { email } = await request.json();
  
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "הכנס אימייל תקין" }, { status: 400 });
  }

  const token = await createSession(email);
  const response = NextResponse.json({ ok: true, email: email.toLowerCase().trim() });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
