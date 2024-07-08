/* eslint-disable react-hooks/exhaustive-deps */
// components/Application/Application.tsx
"use client";
import React, { useState, useEffect } from "react";
import Wordline from "./function/wordline";
import Keyboards from "./keyboards";
import { Slider, useDisclosure } from "@nextui-org/react";
import { Heart, XIcon } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { getUser } from "@/utils/getUser";

const Application: React.FC = () => {
  const router = usePathname();

  const [mode, setMode] = useState("novice");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataGame, setDataGame] = useState<any>({
    progress: 0,
    error: 0,
    accuracy: 100,
    time: 0,
  });

  useEffect(() => {
    setModeTitle(mode);
    onOpen();
  }, []);

  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getData = async () => {
    const data = await getUser();
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const setModeTitle = (mode: string) => {
    return mode.replace(/(\b\w)/, (letter) => letter.toUpperCase());
  };

  return (
    <>
      <div className="container">
        {/* <div className="flex flex-row justify-center items-center mt-10 gap-4 w-full px-24">
          <button onClick={() => router.push("/belajar")}>
            <XIcon size={26} onClick={onClose} />
          </button>
          <Slider
            aria-label="Player progress"
            color="primary"
            hideThumb={true}
            defaultValue={20}
            classNames={{
              label: "text-default-500 font-bold text-small",
              value: "text-default-500 font-bold text-small",
            }}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Heart size={22} className=" text-red-500" fill="var(--red-500)" />
            {loading ? (
              <span className=" text-sm font-bold">0</span>
            ) : (
              <span className=" text-sm font-bold">{user?.data.hearts}</span>
            )}
          </div>
        </div> */}

        <h1 className="text-center text-3xl font-bold mt-10">
          Pelajaran {parseInt(router.split("/").pop() as any) + 1}
        </h1>

        <div className="flex flex-row justify-center items-center align-middle mt-10 gap-4 w-full px-24 py-4">
          <div className="flex items-center gap-2">
            <span className=" text-sm font-bold">
              Progress: {dataGame.progress}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className=" text-sm font-bold">
              Kesalahan: {dataGame.error}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className=" text-sm font-bold">
              Akurasi: {dataGame.accuracy}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className=" text-sm font-bold">Waktu: {dataGame.time}s</span>
          </div>
        </div>
        <div className="wordline-container">
          <Wordline
            dataGame={{
              dataGame,
              setDataGame,
            }}
          />
          <Keyboards />
        </div>
      </div>
    </>
  );
};

export default Application;
