import React, { useEffect } from "react";
import Loading from "@/app/(main)/belajar/loading";
import { getUser } from "@/utils/getUser";
import { UserButton } from "@clerk/nextjs";
import { Heart, Sparkles } from "lucide-react";
import { Slider } from "@nextui-org/react";

const UserCard = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getData = async () => {
    const data = await getUser();
    console.log(data);
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 bg-white m-2 w-80 rounded-lg border-2 border-gray-200 py-5 px-4">
      <div className="flex flex-col gap-2 w-full justify-center items-center">
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

        {loading ? (
          <Loading />
        ) : (
          <span className="text-lg font-bold text-gray-700">
            {user?.data.username}
          </span>
        )}

        <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center">
          <Slider
            aria-label="Player progress"
            label="100 Exp"
            color="foreground"
            hideThumb={true}
            defaultValue={20}
            className="max-w-md"
          />
          <div className="flex justify-between w-full">
            <p className="text-default-500 font-medium text-small">Level 1</p>
            <p className="text-default-500 font-medium text-small">Level 2</p>
          </div>
        </div>
      </div>

      <div className="flex gap-7">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className=" text-primary" />
              <span className=" text-sm font-bold">{user.data.level_user}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={20} className=" text-red-500" />
              <span className=" text-sm font-bold">{user.data.hearts}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserCard;
