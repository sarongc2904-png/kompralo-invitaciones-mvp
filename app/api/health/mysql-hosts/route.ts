import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const hostsToTry = ["auth-db2104.hstgr.io", "127.0.0.1", "localhost"];

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json({
      ok: false,
      message: "DATABASE_URL no existe."
    });
  }

  const parsed = new URL(databaseUrl);
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  const database = parsed.pathname.replace("/", "");
  const port = Number(parsed.port || 3306);

  const results = await Promise.all(
    hostsToTry.map(async (host) => {
      try {
        const connection = await mysql.createConnection({
          host,
          user,
          password,
          database,
          port,
          connectTimeout: 8000
        });

        const [rows] = await connection.execute(
          "SELECT email, role FROM `User` WHERE email = ? LIMIT 1",
          ["admin@kompralo.com.mx"]
        );

        await connection.end();

        return {
          host,
          ok: true,
          adminFound: Array.isArray(rows) && rows.length > 0
        };
      } catch (error) {
        const mysqlError = error as { code?: string; errno?: number; message?: string };

        return {
          host,
          ok: false,
          code: mysqlError.code ?? null,
          errno: mysqlError.errno ?? null,
          message: mysqlError.message ?? "Error desconocido"
        };
      }
    })
  );

  return NextResponse.json({
    ok: results.some((result) => result.ok),
    user,
    database,
    passwordLength: password.length,
    results
  });
}
