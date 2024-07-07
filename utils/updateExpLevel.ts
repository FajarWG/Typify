import getResponse from "@/utils/getResponse";

export const updateExpLevel = async (userId: string, questTitle: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    // Get the quest based on the title
    const quest = await prisma.quest.findFirst({
      where: {
        title: questTitle,
      },
    });
    if (!quest) {
      throw new Error("Quest not found");
    }

    // Get the current user and their exp
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // check if the user has already completed the quest
    const history = await prisma.historyExpUp.findFirst({
      where: {
        userId: userId,
        source: quest.title,
      },
    });

    if (history) {
      return getResponse(null, "Quest already completed", 400);
    }

    // Calculate the updated exp
    const updatedExp = user.exp_user + quest.expReward;
    let newLevel = user.level_user;

    // Get all levels
    const levels = await prisma.level.findMany({ orderBy: { level: "asc" } });
    for (const level of levels) {
      if (updatedExp >= level.expRequired) {
        newLevel = level.level;
      } else {
        break;
      }
    }

    // Update the user's exp and level
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        exp_user: updatedExp,
        level_user: newLevel,
        updatedAt: new Date(),
      },
    });

    // Create a history record
    await prisma.historyExpUp.create({
      data: {
        userId: userId,
        source: quest.title,
        expUp: quest.expReward,
        createdAt: new Date(),
      },
    });

    return { updatedExp, newLevel };
  });

  return result;
};
