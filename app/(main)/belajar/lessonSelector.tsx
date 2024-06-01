// components/LessonSelector.tsx

"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { words } from "@/components/organisims/learn/function/words";
import Generator from "@/components/organisims/learn/function/generator";
import { HoverEffect } from "@/components/organisims/learn/selectCard";

const LessonSelector = () => {
  return (
    <>
      <div className="flex flex-row justify-center flex-wrap gap-8">
        <HoverEffect items={words} />
      </div>
    </>
  );
};

export default LessonSelector;
