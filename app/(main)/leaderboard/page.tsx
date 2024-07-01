"use client";
import { useState, useEffect } from "react";

const TypingTestHistoryComponent = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/leaderboard", {
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
        console.log("test");
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
      <ul>
        {history.map((entry: any, index: any) => (
          <div key={entry.id} className="flex flex-row gap-4">
            {index + 1}.<p>{entry.user.username}</p>
            <p>WPM: {entry.wpm}</p>
            <p>Accuracy: {entry.accuracy}%</p>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TypingTestHistoryComponent;
