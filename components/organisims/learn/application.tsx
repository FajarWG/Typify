// components/Application/Application.tsx
"use client";
import React, { useState, useEffect } from "react";
import Wordline from "./function/wordline";
import Keyboards from "./keyboards";
import { useDisclosure } from "@nextui-org/react";

const Application: React.FC = () => {
  const [mode, setMode] = useState("novice");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setModeTitle(mode);
    onOpen();
  }, [mode]);

  const setModeTitle = (mode: string) => {
    return mode.replace(/(\b\w)/, (letter) => letter.toUpperCase());
  };

  return (
    <>
      <div className="container">
        {/* <div className={`mode-select ${isOpen ? 'open' : ''}`} onClick={handleModeSelectClick}>
        <span className="mode-title">{setModeTitle(mode)}</span>
        <ul>
          <li id="novice" onClick={handleModeChange}>Novice</li>
          <li id="expert" onClick={handleModeChange}>Expert</li>

        </ul>
      </div> */}
        <div className="topbar">
          <div className="speed-stats">
            <span>
              <div className="stats-hint">Speed stats</div>
              <i className="ion-speedometer"></i>
            </span>
            <span className="speed-current">376</span>
            <span>/</span>
            <span className="speed-average">321</span>
          </div>

          <div className="mode-select">
            <i className="ion-ios-game-controller-b"></i>
            <span className="mode-title">Select mode</span>
            <ul className="mode-dropdown">
              <li id="beginner">Beginner</li>
              <li id="novice">Novice</li>
            </ul>
          </div>

          <div className="error-stats">
            <span>
              <div className="stats-hint">Error stats</div>
              <i className="ion-bug"></i>
            </span>
            <span className="error-current"></span>
            <span>/</span>
            <span className="error-average"></span>
          </div>
        </div>
        <Wordline />
        <div className="wordline-container">
          <Keyboards />
        </div>
      </div>
    </>
  );
};

export default Application;
