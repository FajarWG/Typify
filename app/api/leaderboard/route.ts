import Prisma from "@/libs/prisma";
import getResponse from "@/utils/getResponse";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const dataUser = await currentUser();
  if (!dataUser) {
    return NextResponse.redirect("/login");
  }

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
    take: 10,
  });

  const leaderboardFiltered = leaderboard.filter(
    (v: any, i: any, a: any) =>
      a.findIndex((t: any) => t.userId === v.userId) === i
  );

  const users = await Prisma.user.findMany({
    select: {
      username: true,
      level_user: true,
      exp_user: true,
    },
    orderBy: {
      level_user: "desc",
    },
    take: 10,
  });

  leaderboardFiltered.forEach((v: any) => {
    const user = users.find((u: any) => u.username === v.user.username);
    v.user.level_user = user.level_user;
    v.user.exp_user = user.exp_user;
  });

  return getResponse(leaderboardFiltered, "Success get leaderboard", 200);
}
