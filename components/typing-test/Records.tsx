import { useHistory } from "@/utils/useHistory";
import { Skeleton } from "@nextui-org/react";
import { useEffect } from "react";

const TypingTestHistoryComponent = () => {
  const { history, loading } = useHistory();

  if (loading) {
    return (
      <div className=" rounded-lg">
        <h2 className="text-primary font-bold text-center text-xl mb-2">
          Riwayat Tes
        </h2>
        <div className="flex flex-col gap-2">
          <Skeleton className="rounded-lg h-14 w-full" />
          <Skeleton className="rounded-lg h-14 w-full" />
          <Skeleton className="rounded-lg h-14 w-full" />
          <Skeleton className="rounded-lg h-14 w-full" />
          <Skeleton className="rounded-lg h-14 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className=" rounded-lg">
      <h2 className="text-primary font-bold text-center text-xl mb-2">
        Riwayat Tes
      </h2>
      <div className="flex flex-col gap-2">
        {history.map((entry: any, index: number) => (
          <div
            key={entry.id}
            className={`flex flex-row p-2 rounded-md  gap-2 items-center text-center ${
              index % 2 === 0 ? "bg-primary/30" : ""
            }`}
          >
            <div>
              <span className="font-bold">KPM </span>
              <span>{entry.wpm}</span>
            </div>

            <div>
              <span className="font-bold">Akurasi </span>
              <span>{entry.accuracy}%</span>
            </div>

            <div>
              <span className="font-bold">Benar </span>
              <span>{entry.correct}</span>
            </div>

            <div>
              <span className="font-bold">Salah </span>
              <span>{entry.error}</span>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center">Tidak ada riwayat tes</div>
        )}
      </div>
    </div>
  );
};

export default TypingTestHistoryComponent;
