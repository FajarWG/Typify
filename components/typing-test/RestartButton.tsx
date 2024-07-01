"use client";

import { RefreshCcw } from "lucide-react";

type Props = {
  onClick: () => void;
};

const RestartButton: React.FC<Props> = (props) => (
  <div
    className="flex-none p-3 text-gray-100 bg-primary ml-2 md:ml-3 rounded-lg cursor-pointer"
    onClick={props.onClick}
  >
    <RefreshCcw className="h-5 w-5" />
  </div>
);

export default RestartButton;
