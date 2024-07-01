import Prisma from "@/libs/prisma";
import getResponse from "@/utils/getResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const leaderboard = await Prisma.historyTyping.findMany({
      select: {
        userId: true,
        wpm: true,
        accuracy: true,
        user: {
          select: {
            username: true,
            userImageSrc: true,
          },
        },
      },
      orderBy: {
        wpm: "desc",
      },
      take: 10, // Ambil 10 user teratas
    });

    return getResponse(leaderboard, "Success get leaderboard", 200);
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return getResponse(null, "Failed to fetch leaderboard", 500);
  }
}
