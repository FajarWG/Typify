// "use client";

// import Podium from "./Podium";

// type Props = {
//   records: number[];
//   clearRecords: () => void;
//   language: string;
// };

// const Records: React.FC<Props> = (props) => {
//   let lang;
//   switch (props.language) {
//     case "id":
//       lang = "Indonesia";
//       break;
//     case "en":
//       lang = "Inggris";
//       break;
//     case "es":
//       lang = "Spanyol";
//       break;
//     case "fr":
//       lang = "Francis";
//       break;
//     default:
//       lang = "Indonesia";
//       break;
//   }
//   let userRecords;
//   if (props.records.length === 0) {
//     userRecords = (
//       <span className="text-sm text-gray-900 text-center">
//         Saat ini belum ada riwayat.
//       </span>
//     );
//   } else {
//     let firstRecord, secondRecord, thirdRecord;
//     firstRecord = secondRecord = thirdRecord = <></>;

//     const maxRecord: number = props.records[0];
//     const midRecord: number = props.records[1];
//     const maxHeight: number = 96;

//     props.records.forEach((record, index) => {
//       switch (index) {
//         case 0:
//           firstRecord = (
//             <Podium record={record} height={maxHeight} color="bg-indigo-400" />
//           );
//           break;
//         case 1:
//           secondRecord = (
//             <Podium
//               record={record}
//               height={
//                 record === maxRecord
//                   ? maxHeight
//                   : ((record * 0.9) / maxRecord) * maxHeight
//               }
//               color="bg-indigo-300"
//             />
//           );
//           break;
//         case 2:
//           const param = record === midRecord ? 0.9 : 0.8;
//           thirdRecord = (
//             <Podium
//               record={record}
//               height={
//                 record === maxRecord
//                   ? maxHeight
//                   : ((record * param) / maxRecord) * maxHeight
//               }
//               color="bg-indigo-200"
//             />
//           );
//           break;
//       }
//     });
//     userRecords = (
//       <div className="flex flex-row items-end justify-center">
//         {secondRecord}
//         {firstRecord}
//         {thirdRecord}
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto w-56 lg:w-64">
//       <div className="p-4 mt-8 lg:mt-16 bg-white border border-indigo-300 border-solid rounded-lg text-center">
//         <h1 className="font-semibold text-gray-900 mb-2 text-center">
//           Riwayat Tes Bahasa {lang}
//         </h1>
//         {props.records && userRecords}
//       </div>
//       {props.records.length > 0 && (
//         <div
//           className="text-xs text-center py-1 px-2 bg-red-100 mt-2 w-24 mx-auto text-red-800 font-medium rounded-lg hover:bg-red-200 cursor-pointer"
//           onClick={props.clearRecords}
//         >
//           Clear records
//         </div>
//       )}
//     </div>
//   );
// };

// export default Records;

import { useState, useEffect } from "react";

const TypingTestHistoryComponent = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/typing-test/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch typing test history");
        }

        const data = await response.json();
        setHistory(data.data); // Assuming `data` contains a `data` property with the history array
      } catch (error) {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Typing Test History</h2>

      {history.map((entry: any) => (
        <div key={entry.id} className="flex flex-row">
          <p>WPM: {entry.wpm}</p>
          <p>Accuracy: {entry.accuracy}%</p>
          <p>Correct: {entry.correct}</p>
          <p>Error: {entry.error}</p>
        </div>
      ))}
    </div>
  );
};

export default TypingTestHistoryComponent;
