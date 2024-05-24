// components/Wordline/Wordline.tsx
import React, { useEffect, useRef, useState } from "react";

import Generator from "./generator";
import SpeedStats from "./speedStats";
import ErrorStats from "./errorStats";
import Counter from "./counter";
import Keyboard from "./keyboard";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalStart from "../modalStart";

const Wordline: any = ({ mode }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [letters, setLetters] = useState<string[]>([]);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const inputlineRef = useRef<HTMLInputElement>(null);
  const wordlineRef = useRef<HTMLDivElement>(null);

  const errorStats = useRef<ErrorStats>(new ErrorStats());
  const errorCounter = useRef(new Counter());
  const generator = new Generator({
    lesson: "Pelajaran1",
    interval: 60000,
    number: 8,
  });
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
    bindEvents();
    fill(true);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const bindEvents = () => {
    document.addEventListener("click", handleDocumentClick);
  };

  const handleDocumentClick = () => {
    // Handle document click
  };

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

    errorCounter.current.up();

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

  const fill = (isInit = false) => {
    let newLetters: any;
    if (mode === "beginner") {
      newLetters = generator.getOne();
    } else {
      newLetters = generator.getWords();
    }
    setLetters(newLetters);

    if (!isInit) {
      errorStats.current.update(errorCounter.current, newLetters);

      let timeEnd = Date.now();

      speedStats.update(timeEnd - timeStart.current, newLetters);

      errorCounter.current.reset();
    }

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
        <input
          ref={inputlineRef}
          className="inputline"
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div ref={wordlineRef} className="wordline text-start"></div>
      </div>
      <div className="flex justify-between w-full px-20 mt-4">
        <Button
          color="secondary"
          onClick={() => {
            fill();
            highlightKeyTarget();
            if (inputlineRef.current) {
              inputlineRef.current.value = "";
            }
          }}
        >
          Pelajaran Sebelumnya
        </Button>
        <Button
          color={"primary"}
          onClick={() => {
            fill();
            highlightKeyTarget();
            if (inputlineRef.current) {
              inputlineRef.current.value = "";
            }
          }}
        >
          Pelajaran Selanjutnya
        </Button>
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
