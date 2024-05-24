// components/LessonSelector.tsx

"use client";

import React, { useState } from "react";
import { Card, Button, CardBody } from "@nextui-org/react";
import { words } from "./function/words";
import Generator from "./function/generator";

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
    <div>
      <div className=" justify-center align-middle">
        <p>Pilih Pelajaran</p>
      </div>
      <div className="flex flex-row justify-center align-middle">
        {Object.keys(words).map((lesson) => (
          <div key={lesson}>
            <Card>
              <CardBody>
                <p>{lesson}</p>
                <Button
                  onClick={() =>
                    handleLessonSelect(lesson as keyof typeof words)
                  }
                >
                  Pilih
                </Button>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      {selectedLesson && generator && (
        <div className="justify-center align-middle">
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
    </div>
  );
};

export default LessonSelector;
