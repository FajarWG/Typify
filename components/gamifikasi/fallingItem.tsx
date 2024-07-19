import React, { useEffect, useRef } from "react";

interface FallingItemProps {
  id: number;
  top: number;
  left: number;
  text: string;
  image: string;
  typedText: string;
  onAnimationEnd: () => void;
}

const FallingItem: React.FC<FallingItemProps> = ({
  id,
  top,
  left,
  text,
  image,
  typedText,
  onAnimationEnd,
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (itemRef.current) {
      itemRef.current.style.animation = "fall 7s linear";
    }
  }, []);

  const getColoredText = () => {
    let coloredText = [];
    for (let i = 0; i < text.length; i++) {
      let color;
      if (i < typedText.length) {
        color = text[i] === typedText[i] ? "text-green-500" : "text-red-500";
      } else {
        color = "text-black";
      }
      coloredText.push(
        <span key={i} className={color}>
          {text[i]}
        </span>
      );
    }
    return coloredText;
  };

  return (
    <div
      ref={itemRef}
      style={{ left: `${left}px`, top: `${top}px` }}
      className="absolute flex flex-col items-center"
      onAnimationEnd={onAnimationEnd}
    >
      <img src={image} alt={text} className="w-16 h-16 mb-2" />
      <p className="text-center">{getColoredText()}</p>
    </div>
  );
};

export default FallingItem;
