"use client";
import React from "react";
import { useRouter } from "next/navigation";

const StagePage = () => {
  const router = useRouter();

  const handleNavigate = (idx: number) => {
    router.push(`/explorasi/${idx}`);
  };

  return (
    <div className="flex justify-center items-center mt-12">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="w-24 h-24 flex justify-center items-center bg-clip-padding bg-gradient-to-r from-primary to-secondary text-white rounded-full text-lg mx-2 cursor-pointer hover:scale-110 transform transition duration-300"
          onClick={() => handleNavigate(i + 1)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default StagePage;
