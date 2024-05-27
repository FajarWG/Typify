// components/LessonSelector.tsx

"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { words } from "@/components/organisims/learn/function/words";
import Generator from "@/components/organisims/learn/function/generator";
import { HoverEffect } from "@/components/organisims/learn/selectCard";

const LessonSelector: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<
    keyof typeof words | null
  >(null);
  const [generator, setGenerator] = useState<Generator | null>(null);

  const handleLessonSelect = (lesson: keyof typeof words) => {
    setSelectedLesson(lesson);
    setGenerator(new Generator({ lesson }));
  };

  return (
    <>
      <div className="flex flex-row justify-center flex-wrap gap-8">
        <HoverEffect items={words} handleSelect={handleLessonSelect} />
      </div>
      {selectedLesson && generator && (
        <div className="justify-center ">
          <div>
            <Card>
              <CardBody>
                <p>{selectedLesson}</p>
                <p>{generator.getWords()}</p>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default LessonSelector;
