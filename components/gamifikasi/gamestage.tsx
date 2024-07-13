// components/gamifikasi/gamestage.tsx

import React, { useState, useEffect } from "react";
import FallingItem from "./fallingItem";
import { useRouter } from "next/navigation";

interface FallingItemType {
  id: number;
  text: string;
  image: string;
  top: number;
  left: number;
}

interface GameStageProps {
  stageNumber: number;
}

const GameStage: React.FC<GameStageProps> = ({ stageNumber }) => {
  const router = useRouter();
  const [fallingItems, setFallingItems] = useState<FallingItemType[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const startGame = () => {
    setIsStarted(true);
    // Logic to start falling animation
    const interval = setInterval(() => {
      setFallingItems((items) => [
        ...items,
        {
          id: Math.random(),
          text: "example", // Replace with actual text
          image: "example.jpg", // Replace with actual image
          top: 0,
          left: Math.random() * window.innerWidth,
        },
      ]);
    }, 1000); // Adjust timing as needed

    return () => clearInterval(interval);
  };

  const handleGameOver = () => {
    // Handle game over logic, e.g., navigate back to stage selection
    router.push("/explorasi");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isStarted &&
        fallingItems.map((item) => (
          <FallingItem
            key={item.id}
            id={item.id}
            top={item.top}
            left={item.left}
            text={item.text}
            image={item.image}
            onClick={() => handleGameOver()}
          />
        ))}
      {!isStarted && (
        <button
        onClick={() => startGame()}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 text-xl font-bold"
      >
        Mulai
      </button>
      
      )}
    </div>
  );
};

export default GameStage;
