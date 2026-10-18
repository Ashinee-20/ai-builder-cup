import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "chalkevo",
    time: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_API_KEY),
  });
}

