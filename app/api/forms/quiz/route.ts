import { NextResponse } from "next/server";
import { LessonPlanSchema } from "@/lib/planning";
import { hasWorkspaceAccess } from "@/lib/server/access";
import { createLessonQuiz } from "@/lib/server/google-forms";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  if (!hasWorkspaceAccess(request)) return NextResponse.json({ error: "The workspace access code is incorrect." }, { status: 401 });
  const parsed = LessonPlanSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "A valid generated lesson plan is required." }, { status: 400 });
  try {
    return NextResponse.json(await createLessonQuiz(parsed.data));
  } catch (error) {
    console.error("Google Form creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: error instanceof Error ? error.message : "Google Form creation failed." }, { status: 502 });
  }
}
