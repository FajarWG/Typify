"use client";
import React from "react";

import { UserButton } from "@clerk/nextjs";

import { Progress, Skeleton, Slider } from "@nextui-org/react";

import { useLevelQuest } from "@/utils/useLevelQuest";

import { useUser } from "@/utils/useUser";

const UserCard = () => {
  const { users: user, loading }: any = useUser();
  const { level, loading: loadingLevel }: any = useLevelQuest();

  return (
    <div className="flex flex-col sticky top-3 h-fit items-center gap-5 bg-white m-3 w-96 rounded-lg border-2 border-primary p-8">
      <div className="flex flex-col gap-2 w-full justify-center items-center">
        {loading || loadingLevel ? (
          <>
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-32 h-5 rounded-md" />
            <Skeleton className=" w-full h-20 rounded-md" />
          </>
        ) : (
          <>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-16 h-16", // Custom width and height
                  userButtonPopoverCard: "bg-blue-100", // Custom background for the popover card
                  userButtonPopoverActionButton: "text-blue-600", // Custom text color for action buttons
                },
              }}
            />

            <span className="text-lg font-bold text-gray-700">
              {user?.username}
            </span>
            <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center">
              <Progress
                label={`Exp Kamu`}
                size="sm"
                value={user?.exp_user}
                maxValue={level?.level[user?.level_user + 1]?.expRequired}
                color="warning"
                showValueLabel={true}
                valueLabel={user?.exp_user}
                className="max-w-md"
              />
              <div className="flex justify-between w-full">
                <p className="text-default-500 font-medium text-small">
                  Level {user?.level_user}
                </p>
                <p className="text-default-500 font-medium text-small">
                  Level {user?.level_user + 1}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* <div className="flex flex-col gap-2 w-full">
        <p className="text-default-500 font-bold text-lg">Misi Harian</p>

        <div className="flex flex-col gap-4 w-full">
          <Slider
            aria-label="Player progress"
            label="Dapatkan 100 Exp"
            classNames={{
              label: "text-default-500 font-bold text-small",
              value: "text-default-500 font-bold text-small",
            }}
            size="md"
            color="primary"
            hideThumb={true}
            disableThumbScale
            defaultValue={20}
            className="max-w-md"
            startContent={<Zap size={30} className=" text-yellow-500" />}
            endContent={<Gift size={20} className=" text-orange-500" />}
          />

          <Slider
            aria-label="Player progress"
            label="Selesaikan 2 pelajaran mengetik"
            classNames={{
              label: "text-default-500 font-bold text-small",
              value: "text-default-500 font-bold text-small",
            }}
            size="md"
            color="primary"
            hideThumb={true}
            disableThumbScale
            defaultValue={20}
            className="max-w-md"
            startContent={<Target size={30} className=" text-green-500" />}
            endContent={<Gift size={20} className=" text-orange-500" />}
          />

          <Slider
            aria-label="Player progress"
            label="Belajar Selama 10 Menit"
            classNames={{
              label: "text-default-500 font-bold text-small",
              value: "text-default-500 font-bold text-small",
            }}
            size="md"
            color="primary"
            hideThumb={true}
            disableThumbScale
            defaultValue={20}
            className="max-w-md"
            startContent={<AlarmClock size={30} className=" text-blue-500" />}
            endContent={<Gift size={20} className=" text-orange-500" />}
          />
        </div>
      </div>
      <Divider />
      <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full">
        {footer.map((item, index) => (
          <Link
            href={item.url}
            key={index}
            className="text-primary font-bold text-sm cursor-pointer 
            hover:text-secondary-500 transition-all duration-300 ease-in-out
            "
          >
            {item.title}
          </Link>
        ))}
      </div> */}
    </div>
  );
};

export default UserCard;
