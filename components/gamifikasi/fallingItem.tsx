// components/gamifikasi/FallingItem.tsx

import React from "react";

interface FallingItemProps {
  id: number;
  top: number;
  left: number;
  text: string;
  image: string;
  onClick: () => void; // Define onClick function type
}

const FallingItem: React.FC<FallingItemProps> = ({
  id,
  top,
  left,
  text,
  image,
  onClick,
}) => {
  return (
    <div
      style={{ top, left }}
      className="absolute cursor-pointer"
      onClick={onClick} // Handle click event
    >
      <img src={image} alt={text} className="w-12 h-12" />
      <p>{text}</p>
    </div>
  );
};

export default FallingItem;
