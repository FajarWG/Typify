import { NextResponse, type NextRequest } from "next/server";

import { currentTeacher } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await currentTeacher(req);
  if (!session) {
    return NextResponse.json({ teacher: null }, { status: 401 });
  }
  const teacher = await prisma.teacher.findUnique({
    where: { id: session.teacherId },
    select: { id: true, email: true, name: true },
  });
  return NextResponse.json({ teacher });
}