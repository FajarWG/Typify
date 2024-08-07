"use client";

import React, { ChangeEvent, KeyboardEvent } from "react";

interface Props {
  value: string;
  onChange: (inputText: string) => void;
  onKeyUp: (eventKey: string) => void;
  disabled: boolean;
}

const Input: React.FC<Props> = (props) => {
  return (
    <div className="flex-initial w-full">
      <input
        type="text"
        aria-label="Insert word"
        className={`w-full border border-solid ${
          props.disabled
            ? "bg-gray-100 cursor-not-allowed border-gray-400"
            : "bg-white cursor-text border-primary"
        } text-gray-900 font-medium md:text-lg p-3 rounded-md focus:outline-none focus:ring-1`}
        autoFocus
        value={props.value || ""}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          props.onChange(event.target.value)
        }
        onKeyUp={(event: KeyboardEvent) => props.onKeyUp(event.key)}
        disabled={props.disabled}
      />
      <span className="text-sm text-gray-400">
        * Tulis kata yang sesuai dengan kata yang muncul di atas untuk memulai
      </span>
    </div>
  );
};

export default Input;
