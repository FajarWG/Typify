import { UserButton } from "@clerk/nextjs";
import { Bot, Flame, Heart } from "lucide-react";
import React from "react";

const UserCard = () => {
  return (
    <div className="bg-white m-2 w-80 rounded-lg border-2 border-gray-200 p-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Flame size={20} className=" text-orange-600" />
          <span className=" text-sm font-bold">2</span>
        </div>
        <div className="flex items-center gap-2">
          <Bot size={20} className=" text-primary" />
          <span className=" text-sm font-bold">9</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={20} className=" text-red-500" />
          <span className=" text-sm font-bold">9</span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default UserCard;
