"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/react";

const sampleText = "This is a sample text for typing.";

const Home = () => {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.length === 1) {
      setStartTime(new Date());
    }
    if (input === sampleText) {
      const endTime = new Date();
      const timeDiff =
        (endTime.getTime() - (startTime?.getTime() || 0)) / 1000 / 60;
      const words = sampleText.split(" ").length;
      setWpm(Math.round(words / timeDiff));
      setAccuracy(Math.round(((input.length - errors) / input.length) * 100));
    }
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    const value = e.target.value;
    setErrors(
      value.split("").reduce((acc, char, idx) => {
        return char !== sampleText[idx] ? acc + 1 : acc;
      }, 0)
    );
    setInput(value);
  };

  const resetTest = () => {
    setInput("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setErrors(0);
    setIsTyping(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getCharClass = (char: string, idx: number) => {
    if (idx < input.length) {
      return char === input[idx] ? "text-green-500" : "text-red-500";
    }
    return "text-gray-400";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="mb-6 text-4xl font-bold text-center">Typing Test</h1>
      {wpm === null ? (
        <>
          <div
            className={`relative mb-4 text-lg cursor-text transition-opacity duration-500 ease-in-out ${
              isTyping ? "opacity-100" : "opacity-50 animation-idle"
            }`}
            onClick={() => inputRef.current?.focus()}
          >
            {sampleText.split("").map((char, idx) => (
              <span key={idx} className={getCharClass(char, idx)}>
                {char}
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 bg-transparent active:border-none focus:outline-none"
              autoFocus
            />
            <div
              className=" absolute top-0 left-0 w-1 h-full bg-yellow-400 animate-idle"
              id="cursor"
            ></div>
          </div>
          <div className="flex space-x-4 ">
            <p className="text-lg">Errors: {errors}</p>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-lg">WPM: {wpm}</p>
          <p className="mb-4 text-lg">Accuracy: {accuracy}%</p>
          <p className="mb-4 text-lg">Errors: {errors}</p>
          <Button onPress={resetTest} color="primary">
            Restart
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
