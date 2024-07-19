import React, { useState, useEffect } from "react";
import FallingItem from "./fallingItem";
import { useRouter } from "next/navigation";
import foodData from "../../utils/explor/food.json";
import clothingData from "../../utils/explor/clothing.json";
import houseData from "../../utils/explor/house.json";
import weaponData from "../../utils/explor/weapon.json";
import musicData from "../../utils/explor/music.json";

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

const getStageData = (stageNumber: number) => {
  switch (stageNumber) {
    case 1:
      return foodData;
    case 2:
      return clothingData;
    case 3:
      return houseData;
    case 4:
      return weaponData;
    case 5:
      return musicData;
    default:
      return [];
  }
};

const GameStage: React.FC<GameStageProps> = ({ stageNumber }) => {
  const router = useRouter();
  const [fallingItems, setFallingItems] = useState<FallingItemType[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showRetryNotification, setShowRetryNotification] = useState(false);

  const stageData = getStageData(stageNumber);

  const startGame = () => {
    setIsStarted(true);
    setTypedText("");
    setCorrectCount(0);
    setWrongCount(0);
    setShowRetryNotification(false);

    let index = 0;
    const addItemInterval = setInterval(() => {
      if (index >= stageData.length || fallingItems.length >= 5) {
        clearInterval(addItemInterval);
        return;
      }

      // Area untuk gambar dan teks, menghindari area di kiri dan kanan
      const stageElement = document.getElementById("stage");
      const scoreElement = document.getElementById("score");

      const stageWidth = stageElement ? stageElement.offsetWidth : 0;
      const scoreWidth = scoreElement ? scoreElement.offsetWidth : 0;
      const totalWidth = window.innerWidth;
      const availableWidth = totalWidth - stageWidth - scoreWidth;

      const itemWidth = 160; // Lebar item (gambar + margin)
      const maxLeft = totalWidth - itemWidth - 16; // Margin 16px
      const minLeft = stageWidth + 16; // Margin 16px

      const left = Math.min(Math.max(Math.random() * availableWidth + stageWidth, minLeft), maxLeft);

      const newItem = stageData[index];
      setFallingItems((items) => [
        ...items,
        {
          id: Math.random(),
          text: newItem.text,
          image: newItem.image,
          top: 0,
          left: left,
        },
      ]);
      index++;
    }, 2000);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      setTypedText((prev) => prev.slice(0, -1));
      return;
    }
    setTypedText((prev) => prev + event.key);

    const currentItem = fallingItems[0];

    if (currentItem && currentItem.text.startsWith(typedText + event.key)) {
      if (currentItem.text === typedText + event.key) {
        setCorrectCount((count) => count + 1);
        setFallingItems((items) => items.slice(1));
        setTypedText("");
        if (correctCount + 1 === 5) {
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
            if (stageNumber < 5) {
              router.push(`/explorasi/${stageNumber + 1}`);
            } else {
              alert(`Game Over! Benar: ${correctCount + 1}, Salah: ${wrongCount}`);
              router.push("/explorasi");
            }
          }, 5000);
        }
      }
    } else {
      setWrongCount((count) => count + 1);
      setTypedText("");
    }
  };

  const handleGameOver = () => {
    if (fallingItems.length === 0 && correctCount < 5) {
      setShowRetryNotification(true);
    } else {
      alert(`Game Over! Benar: ${correctCount}, Salah: ${wrongCount}`);
      router.push("/explorasi");
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [fallingItems, typedText]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div id="stage" className="absolute top-4 left-4 text-xl font-bold">
        Stage {stageNumber}
      </div>
      <div id="score" className="absolute top-4 right-4 text-xl font-bold">
        Score: {correctCount}
      </div>
      {showNotification && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-primary text-green-700 py-3 px-6 rounded-lg shadow-lg text-center">
          <p className="text-primary text-2xl font-semibold">Stage {stageNumber} Selesai!</p>
          <p className="text-green-500">Benar: {correctCount}</p>
          <p className="text-red-500">Salah: {wrongCount}</p>
        </div>
      )}
      {showRetryNotification && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-primary  py-3 px-6 rounded-lg shadow-lg text-center">
          <p className="text-primary text-2xl font-semibold">Score kamu kurang dari 5!</p>
          <p className="text-green-500">Benar: {correctCount}</p>
          <p className="text-red-500">Salah: {wrongCount}</p>
          <button
            onClick={() => startGame()}
            className="mt-4 bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-lg shadow-lg hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
          >
            Coba Lagi
          </button>
        </div>
      )}
      {isStarted &&
        fallingItems.map((item) => (
          <FallingItem
            key={item.id}
            id={item.id}
            top={item.top}
            left={item.left}
            text={item.text}
            image={item.image}
            typedText={typedText}
            onAnimationEnd={() => {
              setFallingItems((items) => items.filter((i) => i.id !== item.id));
              if (fallingItems.length === 1 && correctCount < 5) {
                setShowRetryNotification(true);
              }
            }}
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
