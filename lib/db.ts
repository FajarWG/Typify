import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  var __typifyPrisma: PrismaClient | undefined;
}

function resolveSqliteUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  if (raw === ":memory:") return raw;
  const stripped = raw.startsWith("file:") ? raw.slice("file:".length) : raw;
  return path.isAbsolute(stripped) ? stripped : path.resolve(process.cwd(), stripped);
}

function resolveProvider(): "sqlite" | "postgresql" {
  // The active provider is reflected in the generated client's runtime type.
  // We sniff it at runtime via the connection string as a fallback.
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("file:") || url === ":memory:" || url.endsWith(".db")) return "sqlite";
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return "postgresql";
  // Default: assume postgres — matches the production brief
  return "postgresql";
}

function createClient(): PrismaClient {
  const isDev = process.env.NODE_ENV !== "production";
  const provider = resolveProvider();
  if (provider === "postgresql") {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({
      adapter,
      log: isDev ? ["error", "warn"] : ["error"],
    });
  }
  // SQLite fallback (dev): keep libsql adapter
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require("@prisma/adapter-libsql") as typeof import("@prisma/adapter-libsql");
  const adapter = new PrismaLibSql({ url: resolveSqliteUrl() });
  return new PrismaClient({
    adapter,
    log: isDev ? ["error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient = globalThis.__typifyPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__typifyPrisma = prisma;
}