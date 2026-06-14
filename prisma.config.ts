import { defineConfig } from "prisma/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Prisma CLI ignora los .env de Next.js cuando detecta este archivo.
// Los cargamos manualmente con node:fs (sin dependencias externas).
// Prioridad: .env.local > .env  (igual que Next.js)
function loadEnvFile(filePath: string) {
  try {
    const lines = readFileSync(resolve(filePath), "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const raw = trimmed.slice(eq + 1).trim();
      // Strip surrounding quotes if present
      const value = raw.replace(/^(["'])(.+)\1$/, "$2");
      // Never overwrite a variable already set in the OS environment
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // File not found — silently skip
  }
}

loadEnvFile(".env.local"); // highest priority
loadEnvFile(".env");       // fallback

export default defineConfig({
  schema: "prisma/schema.prisma",
});
