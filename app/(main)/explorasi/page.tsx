import React from "react";

const StagePage = () => {
  return (
    <>
      <h1 className="text-center py-16 font-extrabold text-2xl">
        Pilih Tahap
      </h1>
      <div className="flex justify-center items-center mt-12">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="w-24 h-24 flex justify-center items-center bg-clip-padding bg-gradient-to-r from-primary to-secondary text-white rounded-full text-lg mx-4 cursor-pointer hover:scale-110 transform transition duration-300"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </>
  );
};

export default StagePage;


 /* 
CODE DIBAWAH SALAH APA KARNA BELUM REACT ROUTER DOM atau NAMAnya Beda

import React from "react";
import { useHistory } from "react-router-dom";

const StagePage = () => {
  const history = useHistory();

  const handleStageClick = (stageNumber: number) => {
    // Misalnya, kita akan navigasi ke halaman berbeda sesuai dengan stage
    history.push(`/stage/${stageNumber}`);
  };

  return (
    <>
      <h1 className="text-center py-16 font-extrabold text-2xl">
        Pilih Tahap
      </h1>
      <div className="flex justify-center items-center mt-12">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="w-24 h-24 flex justify-center items-center bg-clip-padding bg-gradient-to-r from-primary to-secondary text-white rounded-full text-lg mx-4 cursor-pointer hover:scale-110 transform transition duration-300"
            onClick={() => handleStageClick(i + 1)}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </>
  );
};

export default StagePage;
*/