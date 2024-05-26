import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader className="text-primary animate-spin" />
    </div>
  );
};

export default Loading;
