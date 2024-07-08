import { cn } from "@/utils/cn";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: any;
  className?: string;
}) => {
  const router = useRouter();

  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  gap-2",
        className
      )}
    >
      {Object.keys(items).map((lesson, idx) => (
        <div
          key={lesson}
          className="relative group  block p-2 h-full w-full"
          // onClick={() => handleSelect(lesson as keyof typeof items)}
          onClick={() => router.push(`/belajar/${idx}`)}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary dark:bg-slate-800/[0.8] block  rounded-lg"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card
            className="py-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105
             shadow-primary shadow-md duration-300 ease-in-out w-[270px] relative z-20
            "
            key={lesson}
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">
                {lesson.split("n").join("n ")}
              </h4>
              <small className="text-default-500">
                Total yang akan dipelajari: {items[lesson].length}
              </small>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="/img/hero-card-complete.jpeg"
                width={270}
                height={200}
              />
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
};
