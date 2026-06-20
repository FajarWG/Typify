// Typify · teacher authentication
//
// Hand-rolled auth: argon2id for password hashing (via hash-wasm, pure WASM,
// runs on bun + node), HS256 JWT for session tokens, httpOnly cookie storage.
// No third-party auth library — the brief specifies only teachers log in,
// there's no OAuth or multi-role complexity to justify one.

import { SignJWT, jwtVerify } from "jose";
import { argon2Verify, argon2id } from "hash-wasm";

import { prisma } from "@/lib/db";

// -----------------------------------------------------------------------------
// Password hashing
// -----------------------------------------------------------------------------

const ARGON2_OPTIONS = {
  iterations: 3,
  parallelism: 1,
  memorySize: 65536, // 64 MiB — OWASP recommended for argon2id
  hashLength: 32,
} as const;

const encoder = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return argon2id({
    password,
    salt,
    ...ARGON2_OPTIONS,
    outputType: "encoded",
  });
}

export async function verifyPassword(stored: string, candidate: string): Promise<boolean> {
  try {
    return await argon2Verify({ password: candidate, hash: stored });
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// JWT session tokens (HS256)
// -----------------------------------------------------------------------------

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days
const SESSION_COOKIE = "typify_session";

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is not set or is too short. Set a 32+ character random string in .env.",
    );
  }
  return encoder.encode(secret);
}

export interface SessionPayload {
  teacherId: string;
  email: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ teacherId: payload.teacherId, email: payload.email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (typeof payload.teacherId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { teacherId: payload.teacherId, email: payload.email };
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Cookie helpers (server-only — used by route handlers)
// -----------------------------------------------------------------------------

export function setSessionCookie(token: string): string {
  const maxAge = SESSION_TTL_SECONDS;
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookie(): string {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export async function readSessionFromCookieHeader(
  cookieHeader: string | null | undefined,
): Promise<SessionPayload | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(/;\s*/)
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  const token = match.slice(SESSION_COOKIE.length + 1);
  return verifySession(token);
}

// -----------------------------------------------------------------------------
// Convenience: resolve the current teacher from a Next 16 request
// -----------------------------------------------------------------------------

export async function currentTeacher(req: Request): Promise<SessionPayload | null> {
  const cookie = req.headers.get("cookie");
  return readSessionFromCookieHeader(cookie);
}

// -----------------------------------------------------------------------------
// Server-only: validate class code + link a student
// -----------------------------------------------------------------------------

const CLASS_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // unambiguous characters

export function generateClassCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  let suffix = "";
  for (const byte of bytes) suffix += CLASS_CODE_ALPHABET[byte % CLASS_CODE_ALPHABET.length];
  return `TYPF-${suffix}`;
}

export async function findClassroomByCode(code: string) {
  return prisma.classroom.findUnique({ where: { code: code.trim().toUpperCase() } });
}

export async function linkStudentToClassroom(
  anonymousId: string,
  classCode: string,
): Promise<{ ok: true } | { ok: false; reason: "no-class" | "already-linked" }> {
  const code = classCode.trim().toUpperCase();
  const classroom = await prisma.classroom.findUnique({ where: { code } });
  if (!classroom) return { ok: false, reason: "no-class" };
  const existing = await prisma.student.findUnique({ where: { anonymousId } });
  if (existing && existing.classCode) return { ok: false, reason: "already-linked" };
  if (existing) {
    await prisma.student.update({
      where: { anonymousId },
      data: { classCode: code },
    });
  } else {
    await prisma.student.create({
      data: {
        anonymousId,
        nickname: "anonymous",
        mascot: "cat",
        primaryColor: "oklch(86% 0.18 95)",
        homeCulture: "id",
        uiLanguage: "en",
        keyboardLayout: "qwerty",
        classCode: code,
      },
    });
  }
  return { ok: true };
}