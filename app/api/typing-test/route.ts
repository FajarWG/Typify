import Prisma from "@/libs/prisma";
import getResponse from "@/utils/getResponse";
import { updateExpLevel } from "@/utils/updateExpLevel";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const dataUser = await currentUser();
  const body = await req.json();
  const { wpm, accuracy, correct, error, time, questTitle } = body;

  if (!dataUser) {
    return getResponse(null, "Unauthorized", 401);
  }

  // Save the typing test result
  const historyTyping = await Prisma.historyTyping.create({
    data: {
      userId: dataUser.id,
      wpm,
      accuracy,
      correct,
      error,
      time,
    },
  });

  // hit api to update exp and level
  const updateExp = updateExpLevel(dataUser.id, questTitle);

  return getResponse(
    historyTyping + updateExp,
    "Success save typing test history",
    200
  );
}

export async function GET(req: NextRequest) {
  const dataUser = await currentUser();

  if (!dataUser) {
    return getResponse(null, "Unauthorized", 401);
  }

  const history = await Prisma.historyTyping.findMany({
    where: {
      userId: dataUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return getResponse(history, "Success get typing test history", 200);
}
