"use client";

import React from "react";

interface Props {
  wpm: number;
  correctKeystroke: number;
  wrongKeystroke: number;
  accuracy: string;
  correctWords: number;
  wrongWords: number;
  timer: number;
}

const Result: React.FC<Props> = (props) => (
  <div className="mx-auto lg:mx-0 mt-8 lg:mt-0 w-full rounded-lg bg-white border border-solid border-gray-200">
    <div className="rounded-t-lg py-5 bg-primary border-b border-solid border-indigo-200">
      <p className="text-center text-4xl font-bold text-white">
        {props.wpm} KPM
      </p>
      <p className="text-xs text-indigo-100 text-center">(kata per menit)</p>
      <p className="text-xs text-indigo-50 text-center">
        5 Karakter Benar = 1 KPM
      </p>
    </div>
    <div className="flex flex-row justify-center my-2">
      <div className=" flex justify-between text-center font-bold">
        <span className="mx-2">Karakter: </span>
        <span className="mr-4">
          <span className="text-green-600">{props.correctKeystroke}</span> |{" "}
          <span className="text-red-400">{props.wrongKeystroke}</span>{" "}
          <span className="font-bold">
            {/* {props.correctKeystroke + props.wrongKeystroke} */}
          </span>
        </span>
      </div>
      <div className="flex justify-between font-bold">
        <span className="mx-2">Akurasi: </span>
        <span className="font-bold text-center mr-4">
          {isNaN(parseInt(props.accuracy)) ? 0 : props.accuracy}%
        </span>
      </div>
      <div className="flex justify-between font-bold">
        <span className="mx-2">Kata: </span>

        <span className="mr-4">
          <span className="text-green-600">{props.correctWords}</span> |{" "}
          <span className="text-red-400">{props.wrongWords}</span>{" "}
          <span className="font-bold">
            {/* {props.correctKeystroke + props.wrongKeystroke} */}
          </span>
        </span>
      </div>
      {/* <div className="flex justify-between font-bold">
        <span className="mx-2">Kata Salah: </span>
        <span className="font-bold text-red-400 mr-4">{props.wrongWords}</span>
      </div> */}
      <div className="flex justify-between font-bold">
        <span className="mx-2">Waktu: </span>
        <span className="font-bold text-black mr-4">
          {Math.floor(props.timer / 60)}:
          {(props.timer % 60).toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  </div>
);

export default Result;
