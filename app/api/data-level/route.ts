import getResponse from "@/utils/getResponse";
import Prisma from "@/libs/prisma";

export async function POST() {
  //level
  await Prisma.level.createMany({
    data: [
      { level: 1, expRequired: 100 },
      { level: 2, expRequired: 250 },
      { level: 3, expRequired: 450 },
      { level: 4, expRequired: 700 },
      { level: 5, expRequired: 1000 },
      { level: 6, expRequired: 1350 },
      { level: 7, expRequired: 1750 },
      { level: 8, expRequired: 2200 },
      { level: 9, expRequired: 2700 },
      { level: 10, expRequired: 3250 },
      { level: 11, expRequired: 3850 },
      { level: 12, expRequired: 4500 },
      { level: 13, expRequired: 5200 },
      { level: 14, expRequired: 5950 },
      { level: 15, expRequired: 6750 },
      { level: 16, expRequired: 7600 },
      { level: 17, expRequired: 8500 },
      { level: 18, expRequired: 9450 },
      { level: 19, expRequired: 10450 },
      { level: 20, expRequired: 11500 },
    ],
  });

  await Prisma.quest.createMany({
    data: [
      {
        title: "Belajar 10 menit",
        description: "Selesaikan belajar mengetik selama 10 menit",
        expReward: 20,
        type: "Daily",
      },
      {
        title: "Selesaikan 1 pelajaran",
        description: "Selesaikan satu pelajaran mengetik",
        expReward: 20,
        type: "Daily",
      },
      {
        title: "Selesaikan 2 pelajaran",
        description: "Selesaikan dua pelajaran mengetik",
        expReward: 40,
        type: "Daily",
      },
      {
        title: "Eksplorasi Budaya 1x",
        description: "Selesaikan satu aktivitas eksplorasi budaya",
        expReward: 30,
        type: "Daily",
      },
      {
        title: "Tes Mengetik Harian",
        description: "Ikuti tes mengetik harian",
        expReward: 15,
        type: "Daily",
      },
      {
        title: "Bonus Harian",
        description: "Menyelesaikan semua quest harian",
        expReward: 50,
        type: "Daily",
      },
      {
        title: "Posisi 1 di leaderboard Mingguan Tes Mengetik",
        description:
          "Mendapatkan posisi 1 di leaderboard mingguan tes mengetik",
        expReward: 200,
        type: "Weekly",
      },
    ],
  });

  return getResponse(null, "Success create data level", 200);
}

export async function GET() {
  const level = await Prisma.level.findMany();
  const quest = await Prisma.quest.findMany();

  return getResponse({ level, quest }, "Success get data level", 200);
}
