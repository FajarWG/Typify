import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import Prisma from "./prisma";

export const getUserSession = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await Prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return data;
});
