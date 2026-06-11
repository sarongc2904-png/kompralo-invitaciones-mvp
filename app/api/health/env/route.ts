import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json({
      ok: false,
      databaseUrlFound: false
    });
  }

  try {
    const parsed = new URL(databaseUrl);

    return NextResponse.json({
      ok: true,
      databaseUrlFound: true,
      protocol: parsed.protocol,
      username: decodeURIComponent(parsed.username),
      passwordLength: decodeURIComponent(parsed.password).length,
      host: parsed.hostname,
      port: parsed.port,
      database: parsed.pathname.replace("/", "")
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid DATABASE_URL";

    return NextResponse.json(
      {
        ok: false,
        databaseUrlFound: true,
        message
      },
      { status: 500 }
    );
  }
}
