import { NextResponse } from "next/server";
import { isAllowedEmail, createSession } from "@/lib/auth";

export async function POST(request) {
  const { email } = await request.json();
  
  if (!email || !isAllowedEmail(email)) {
    return NextResponse.json({ 
      error: "אימייל לא מורשה",
      debug: process.env.ALLOWED_EMAILS ? "env set" : "env missing"
    }, { status: 401 });
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
