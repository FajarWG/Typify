"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import LanguageSelector from "@/components/typing-test/LanguageSelector";
import Heading from "@/components/typing-test/Heading";
import WordContainer from "@/components/typing-test/WordContainer";
import Input from "@/components/typing-test/Input";
import Result from "@/components/typing-test/Result";
import Timer from "@/components/typing-test/Timer";
import RestartButton from "@/components/typing-test/RestartButton";
import Records from "@/components/typing-test/Records";
import { shuffleWord } from "@/utils/typing-test/shuffleWord";

const Home = () => {
  const [words, setWords] = useState<string[]>([""]);
  const [wordInput, setWordInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("id");
  const [isInputCorrect, setIsInputCorrect] = useState<boolean>(true);
  const [correctKeystroke, setCorrectKeystroke] = useState<number>(0);
  const [wrongKeystroke, setWrongKeystroke] = useState<number>(0);
  const [correction, setCorrection] = useState<number>(0);
  const [correctWords, setCorrectWords] = useState<number>(0);
  const [wrongWords, setWrongWords] = useState<number>(0);
  const [records, setRecords] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(30);
  const [isTimerStarted, setIsTimerStarted] = useState<boolean>(false);
  const numberOfWords: number = useMemo(() => 200, []);
  const currentWord: string = useMemo(() => words[0], [words]);
  const totalKeyStrokes: number = useMemo(
    () => correctKeystroke + wrongKeystroke,
    [correctKeystroke, wrongKeystroke]
  );

  const intervalRef = useRef<any>(null);

  useEffect(() => {
    setWords(shuffleWord(numberOfWords, language));
    const userRecords = localStorage.getItem(language.concat("_records"));
    const records = userRecords ? JSON.parse(userRecords) : ([] as number[]);
    setRecords(records);
  }, [numberOfWords, language]);

  useEffect(() => {
    if (timer === 0) {
      const userRecords = localStorage.getItem(language.concat("_records"));
      let records = userRecords ? JSON.parse(userRecords) : ([] as number[]);

      const userResult = Math.round(correctKeystroke / 5 / 0.5);
      if (userResult > 0) {
        let newRecords = records.concat(userResult);
        newRecords.sort((a: number, b: number) => b - a);

        if (newRecords.length > 3) {
          newRecords = newRecords.slice(0, -1);
        }

        submitTypingTestResults();

        localStorage.setItem(
          language.concat("_records"),
          JSON.stringify(newRecords)
        );
        setRecords(newRecords);
      }
    }
  }, [timer, correctKeystroke, language]);

  const languageHandler = (newLanguage: string) => {
    setLanguage(newLanguage);
  };
  const timerHandler = () => {
    let timesLeft: number = timer;
    intervalRef.current = setInterval(() => {
      timesLeft -= 1;
      setTimer((prevTimer) => prevTimer - 1);

      if (timesLeft <= 0) {
        clearInterval(intervalRef.current);
        setIsTimerStarted(false);
      }
    }, 1000);
  };
  const inputHandler = (inputText: string) => {
    setWordInput(inputText);

    if (inputText.endsWith(" ")) {
      setWordInput("");
    }

    if (inputText.trim().length > 0) {
      //in if check the inputtext should be trimmed since when checking happens, it might contains space at the end
      if (
        currentWord &&
        inputText.trim() !== currentWord.slice(0, inputText.length)
      ) {
        setIsInputCorrect(false);
      } else {
        setIsInputCorrect(true);
      }

      if (inputText.endsWith(" ")) {
        const inputWord: string = inputText.slice(0, -1);
        if (inputWord === currentWord) {
          setCorrectWords((prev) => prev + 1);
        } else {
          setWrongWords((prev) => prev + 1);
        }

        setWords((prevWords) => prevWords.slice(1));
      }
    }
  };

  const keyUpHandler = (key: string) => {
    if (key.length === 1 && key !== " ") {
      if (totalKeyStrokes === 0) {
        //start timer when user first enter key
        setIsTimerStarted(true);
        timerHandler();
      }

      if (isInputCorrect) {
        setCorrectKeystroke((prev) => prev + 1);
      } else {
        setWrongKeystroke((prev) => prev + 1);
      }
    }

    if (key === "Backspace") {
      setCorrection((prev) => prev + 1);
    }
  };

  const restartHandler = () => {
    clearInterval(intervalRef.current);
    setWords(shuffleWord(numberOfWords, language));
    setWordInput("");
    setIsInputCorrect(true);
    setCorrectKeystroke(0);
    setWrongKeystroke(0);
    setCorrection(0);

    setCorrectWords(0);
    setWrongWords(0);
    setTimer(30);
    setIsTimerStarted(false);
  };

  const clearRecords = () => {
    const bestRecords = localStorage.getItem(language.concat("_records"));
    if (bestRecords) {
      localStorage.removeItem(language.concat("_records"));
      setRecords([]);
    }
  };

  const submitTypingTestResults = async () => {
    try {
      const response = await fetch("/api/typing-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wpm: Math.round(correctKeystroke / 5 / 0.5),
          accuracy: (
            ((correctKeystroke * 100) / (totalKeyStrokes + correction)) as any
          ).toFixed(2),
          correct: correctKeystroke,
          error: wrongKeystroke,
          time: 30,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Typing test results saved successfully.");
      } else {
        console.log(`Error: ${data.message}`);
      }
    } catch (error) {
      console.log(
        "An error occurred while submitting the typing test results."
      );
    }
  };

  return (
    <>
      <div className="font-inter p-8 md:p-14 lg:p-16">
        <div className="flex">
          <div className="flex-none">
            <Heading />
            <Result
              wpm={Math.round(correctKeystroke / 5 / 0.5)}
              correctKeystroke={correctKeystroke}
              wrongKeystroke={wrongKeystroke}
              accuracy={(
                (correctKeystroke * 100) /
                (totalKeyStrokes + correction)
              ).toFixed(2)}
              correctWords={correctWords}
              wrongWords={wrongWords}
              timer={timer}
            />
            <div className="md:max-w-4xl lg:max-w-2xl xl:max-w-3xl lg:mr-8">
              <WordContainer
                words={words}
                isInputCorrect={isInputCorrect || wordInput.length === 0}
              />
              <div className="flex flex-row flex-wrap md:flex-nowrap items-center justify-center mt-6 md:mt-8">
                <Input
                  value={wordInput}
                  disabled={timer === 0}
                  onChange={inputHandler}
                  onKeyUp={keyUpHandler}
                />
                <div className="flex-0 flex my-5 lg:my-0">
                  <RestartButton onClick={restartHandler} />
                </div>
                <LanguageSelector
                  disabled={isTimerStarted}
                  language={language}
                  onChange={languageHandler}
                />
              </div>
            </div>
            {/* <p className="text-justify text-gray-900 mt-5 text-sm lg:hidden sm:w-4/5 md:w-2/3 mx-auto">
              This site needs to detect what kind of key is entered by the user
              to start the timer and calculate the keystrokes.
              <br />
              <br />
              However, it doesnst work properly without physical keyboard, so
              please consider using any device with a physical keyboard to
              access this site.
            </p> */}
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col justify-around lg:ml-24">
            <Records
            // records={records}
            // clearRecords={clearRecords}
            // language={language}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
