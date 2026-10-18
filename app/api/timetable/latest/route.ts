import { NextResponse } from "next/server";
import { hasWorkspaceAccess } from "@/lib/server/access";
import { loadWorkspace } from "@/lib/server/firestore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!hasWorkspaceAccess(request)) return NextResponse.json({ error: "The workspace access code is incorrect." }, { status: 401 });
  try {
    const workspace = await loadWorkspace();
    return workspace ? NextResponse.json(workspace) : NextResponse.json({ error: "No saved timetable exists yet." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "The saved workspace could not be loaded." }, { status: 503 });
  }
}
