// ./app/(main)/explorasi/[id]/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Menggunakan next/navigation

import GameStage from "@/components/gamifikasi/gamestage";

const Page = ({ params }: any) => {
  const router = useRouter();
  const { id } = params;

  // Menangani kasus ketika id tidak ada atau tidak valid
  if (typeof id !== "string") {
    return null;
  }

  return <GameStage stageNumber={parseInt(id, 10)} />;
};

export default Page;
