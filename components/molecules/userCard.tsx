import React, { useEffect } from "react";
import Loading from "@/app/(main)/belajar/loading";
import { getUser } from "@/utils/getUser";
import { UserButton } from "@clerk/nextjs";
import {
  AlarmClock,
  Gift,
  Heart,
  Package2,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Divider, Slider } from "@nextui-org/react";
import Link from "next/link";

const footer = [
  {
    title: "Tentang",
    url: "/tentang",
  },
  {
    title: "Kolaborasi",
    url: "/kolaborasi",
  },
  {
    title: "Ketentuan",
    url: "/ketentuan",
  },
  {
    title: "Privasi",
    url: "/privasi",
  },
];

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
    <div className="flex flex-col sticky top-3 h-fit items-center gap-5 bg-white m-3 w-96 rounded-lg border-2 border-primary p-8">
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
            color="primary"
            hideThumb={true}
            defaultValue={20}
            classNames={{
              label: "text-default-500 font-bold text-small",
              value: "text-default-500 font-bold text-small",
            }}
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
      <Divider />
      <div className="flex flex-col gap-2 w-full">
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
      </div>
    </div>
  );
};

export default UserCard;
