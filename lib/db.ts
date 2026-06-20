import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
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
  const absolute = path.isAbsolute(stripped)
    ? stripped
    : path.resolve(process.cwd(), stripped);
  return `file:${absolute}`;
}

function createClient(): PrismaClient {
  const isDev = process.env.NODE_ENV !== "production";
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