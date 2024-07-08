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
import ModalDone from "../modalDone";

const Wordline: any = ({ mode, dataGame }: any) => {
  let id = useParams().id as any;
  id = parseInt(id) + 1;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [letters, setLetters] = useState<string[]>([]);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const inputlineRef = useRef<HTMLInputElement>(null);
  const wordlineRef = useRef<HTMLDivElement>(null);

  const timeStart = useRef<number>(0);

  const [keyboard, setKeyboard] = useState<any>();

  useEffect(() => {
    onOpen();
    // Ensure the code runs only in the client
    if (typeof window !== "undefined") {
      const kb = new Keyboard();

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

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const {
    isOpen: isDoneOpen,
    onOpen: onDoneOpen,
    onClose: onDoneClose,
  } = useDisclosure();

  const [startTime, setStartTime] = useState(Date.now());
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
    }
  }, [isOpen]);

  useEffect(() => {
    if (isDoneOpen) {
      updateGameProgress();
    } else {
      const interval = setInterval(() => {
        updateGameProgress();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPhraseIndex]);

  const updateGameProgress = () => {
    const learnWords = words[`Pelajaran${id}`];
    const progress = ((currentPhraseIndex + 1) / learnWords.length) * 100;
    const timeElapsed = (Date.now() - startTime) / 1000; // in seconds

    const accuracy = totalKeystrokes
      ? ((totalKeystrokes - dataGame.dataGame.error) / totalKeystrokes) * 100
      : 100;

    dataGame.setDataGame((prevData: any) => {
      return {
        ...prevData,
        progress: progress.toFixed(2),
        time: timeElapsed.toFixed(1),
        accuracy: accuracy.toFixed(2),
      };
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setTotalKeystrokes((prev) => prev + 1);
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
        moveToNextPhrase();
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

    dataGame.setDataGame((prevData: any) => {
      return {
        ...prevData,
        error: prevData.error + 1,
      };
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
      setCorrectKeystrokes((prev) => prev + 1);
      output = true;
    }

    if (untyped.length === 0 && letter === " ") {
      output = true;
      moveToNextPhrase();
    }

    if (output) {
      highlightKeyTarget();
    }

    return output;
  };

  const fill = () => {
    const learnWords = words[`Pelajaran${id}`];

    if (!learnWords || learnWords.length === 0) {
      console.error("No words found for the specified id.");
      return;
    }

    let newLetters = learnWords[currentPhraseIndex];

    setLetters(newLetters);

    let markup = newLetters
      .split("")
      .map(
        (letter: any) => `<span class="${untypedClass} letter">${letter}</span>`
      )
      .join("");

    if (wordlineRef.current) {
      wordlineRef.current.innerHTML = markup;
    }

    if (inputlineRef.current) {
      inputlineRef.current.style.width = `${wordlineRef.current?.clientWidth}px`;
    }

    highlightKeyTarget(); // Update the visual indicator for the first key of the new phrase
  };

  const highlightKeyTarget = () => {
    const untyped = document.querySelectorAll(`.${untypedClass}`);
    let keyTarget = untyped[0]?.textContent?.trim() || "space";
    let pressed = letters[letters.length - 1];
    if (untyped.length > 0) {
      pressed = untyped[0]?.previousSibling?.textContent?.trim() || "space";
    }
    let toPress = keyTarget;

    if (keyboard && typeof keyboard.highlight === "function") {
      keyboard.highlight(pressed, toPress);
    } else {
      console.warn("Keyboard object or highlight method is not defined.");
    }
  };

  const moveToNextPhrase = () => {
    setCurrentPhraseIndex((prevIndex) => {
      const learnWords = words[`Pelajaran${id}`];
      const nextIndex = prevIndex + 1;
      if (nextIndex < learnWords.length) {
        clean(); // Clear the input line text
        setLetters(learnWords[nextIndex]);
        updateGameProgress(); // Update game progress here
        return nextIndex;
      } else {
        clean();
        updateGameProgress(); // Update game progress for the last phrase
        onDoneOpen(); // Open the done modal
        return 0; // Reset to the first phrase if all phrases are completed
      }
    });
  };

  useEffect(() => {
    fill();
  }, [id, currentPhraseIndex]);

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
      <ModalDone
        hook={{
          isOpen: isDoneOpen,
          onOpen: onDoneOpen,
          onClose: onDoneClose,
        }}
        dataGame={dataGame}
      />
    </>
  );
};

export default Wordline;
