// components/Wordline/Wordline.tsx
import React, { useEffect, useRef, useState } from "react";

import Generator from "./generator";
import SpeedStats from "./speedStats";
import ErrorStats from "./errorStats";
import Counter from "./counter";
import Keyboard from "./keyboard";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalStart from "../modalStart";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { words } from "./words";

const Wordline: any = ({ mode, dataGame }: any) => {
  let id = useParams().id as any;
  id = parseInt(id) + 1;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [letters, setLetters] = useState<string[]>([]);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const inputlineRef = useRef<HTMLInputElement>(null);
  const wordlineRef = useRef<HTMLDivElement>(null);

  const errorStats = useRef<ErrorStats>(new ErrorStats());
  const errorCounter = useRef(new Counter());
  // const generator = new Generator({
  //   lesson: `Pelajaran${id}` as any,
  // });

  const timeStart = useRef<number>(0);

  const [keyboard, setKeyboard] = useState<any>();

  const [speedStats, setSpeedStats] = useState<any>();

  useEffect(() => {
    onOpen();
    // Ensure the code runs only in the client
    if (typeof window !== "undefined") {
      const kb = new Keyboard();
      const ss = new SpeedStats();
      setSpeedStats(ss);
      setKeyboard(kb);
    }
  }, []);

  const untypedClass = "untyped";
  const wrongClass = "wrong";

  useEffect(() => {
    if (inputlineRef.current) {
      inputlineRef.current.value = "";
    }
    fill();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      letters.length === document.querySelectorAll(`.${untypedClass}`).length &&
      e.key !== "Enter"
    ) {
      timeStart.current = Date.now();
    }

    const isOk = check(String.fromCharCode(e.charCode));

    if (!isOk) {
      letters.length ? highlightMistake() : fill();
    }

    return isOk;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Control") setCtrlPressed(true);

    if (e.key === "Backspace") {
      if (ctrlPressed) {
        setCtrlPressed(false);
        let curValue = inputlineRef.current?.value.trim() || "";

        let lastSpaceIndex = curValue.lastIndexOf(" ");

        rollback(lastSpaceIndex);

        if (inputlineRef.current) {
          inputlineRef.current.value = curValue.slice(0, lastSpaceIndex + 1);
        }

        return false;
      } else return false;
    }

    if (e.key === "Enter") {
      if (document.querySelectorAll(`.${untypedClass}`).length === 0) {
        clean();
      }
    }
  };

  const highlightMistake = () => {
    const untyped = document.querySelectorAll(`.${untypedClass}`);

    untyped.forEach((el) => el.classList.add(wrongClass));
    if (inputlineRef.current) {
      inputlineRef.current.classList.add(wrongClass);
    }

    setTimeout(() => {
      untyped.forEach((el) => el.classList.remove(wrongClass));
      if (inputlineRef.current) {
        inputlineRef.current.classList.remove(wrongClass);
      }
    }, 200);

    dataGame.setDataGame({
      ...dataGame.dataGame,
      error: dataGame.dataGame.error + 1,
    });

    return false;
  };

  const rollback = (index: number) => {
    const letterEls = document.querySelectorAll(".letter");
    for (let i = index + 1; i < letterEls.length; i++) {
      letterEls[i].classList.add(untypedClass);
    }
  };

  const clean = () => {
    setLetters([]);
    if (wordlineRef.current) {
      wordlineRef.current.textContent = "";
    }
    if (inputlineRef.current) {
      inputlineRef.current.value = "";
    }
  };

  const check = (letter: string) => {
    const untyped = document.querySelectorAll(`.${untypedClass}`);

    let output = false;

    if (letter === untyped[0]?.textContent) {
      untyped[0].classList.remove(untypedClass);
      output = true;
    }

    if (untyped.length === 0 && letter === " ") {
      output = false;
      clean();
    }

    if (output) {
      highlightKeyTarget();
    }

    return output;
  };

  const fill = () => {
    // let newLetters: any = generator.getWords();
    const learnWords = words[`Pelajaran${id}`] as any;

    let newLetters = learnWords[0];

    setLetters(newLetters);

    let markup = "";
    for (let letter of newLetters) {
      markup += `<span class="${untypedClass} letter">${letter}</span>`;
    }

    if (wordlineRef.current) {
      wordlineRef.current.innerHTML = markup;
    }

    if (inputlineRef.current) {
      inputlineRef.current.style.width =
        wordlineRef.current?.clientWidth + "px";
    }
  };

  const highlightKeyTarget = () => {
    const untyped = document.querySelectorAll(`.${untypedClass}`);

    let keyTarget = untyped[0]?.textContent?.trim() || "space";

    let pressed = letters[letters.length - 1];
    if (untyped.length > 0) {
      pressed = untyped[0]?.previousSibling?.textContent?.trim() || "space";
    }
    let toPress = keyTarget;

    keyboard.highlight(pressed, toPress);
  };

  return (
    <>
      <div className="wordline-component text-center">
        <div
          ref={wordlineRef}
          className="wordline text-start font-bold text-xl"
        ></div>
        <input
          ref={inputlineRef}
          className="inputline rounded-md font-bold mb-4"
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
      <ModalStart
        hook={{
          isOpen,
          onOpen,
          onClose,
        }}
        start={highlightKeyTarget}
      />
    </>
  );
};

export default Wordline;
