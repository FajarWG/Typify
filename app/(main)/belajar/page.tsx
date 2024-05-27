"use client";
import Application from "@/components/organisims/learn/application";
import LessonSelector from "./lessonSelector";
import React from "react";

const LearnPage = () => {
  return (
    <>
      <h1 className="text-center py-16 font-extrabold text-2xl">
        Belajar Mengetik 10 Jari
      </h1>
      <LessonSelector />
    </>
  );
};

export default LearnPage;
