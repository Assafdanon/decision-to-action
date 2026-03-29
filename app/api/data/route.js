import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { kv } from "@vercel/kv";

function userKey(email) {
  return `dta:${email}`;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const data = await kv.get(userKey(session.email));
    return NextResponse.json({ entries: data || [] });
  } catch (e) {
    console.error("KV error:", e.message);
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { entry } = await request.json();
  const key = userKey(session.email);
  try {
    const existing = (await kv.get(key)) || [];
    const newEntry = { ...entry, id: Date.now().toString(), createdAt: new Date().toISOString() };
    const updated = [newEntry, ...existing].slice(0, 100);
    await kv.set(key, updated);
    return NextResponse.json({ ok: true, entry: newEntry });
  } catch (e) {
    console.error("KV error:", e.message);
    return NextResponse.json({ ok: true, entry: { ...entry, id: Date.now().toString() } });
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try { await kv.del(userKey(session.email)); } catch (e) { console.error("KV error:", e.message); }
  return NextResponse.json({ ok: true });
}
