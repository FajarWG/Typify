import Prisma from "@/libs/prisma";
import getResponse from "@/utils/getResponse";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const dataUser = await currentUser();

  const user = await Prisma.user.findUnique({
    where: {
      id: dataUser?.id,
    },
  });

  //   Auto Create User if not exist
  if (user === null) {
    const newUser = await Prisma.user.create({
      data: {
        id: dataUser?.id,
        username: dataUser?.username ?? "",
        userImageSrc: dataUser?.imageUrl ?? "",
      },
    });

    return getResponse(newUser, "success create new user", 201);
  }

  return getResponse(user, "success get user", 200);
}
