import { useEffect, useState } from "react";

export const useLevelQuest = () => {
  const [level, setLevel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const featchData = async () => {
      try {
        const response = await fetch("/api/data-level", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch typing test level");
        }

        const data = await response.json();

        if (data.data.length > 5) {
          data.data = data.data.slice(0, 5);
        }

        setLevel(data.data);
      } catch (error) {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };

    featchData();
  }, []);

  return { level, loading };
};
