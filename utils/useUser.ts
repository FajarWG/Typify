import { useEffect, useState } from "react";

export const useUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/register", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch typing test history");
        }

        const data = await response.json();

        if (data.data.length > 5) {
          data.data = data.data.slice(0, 5);
        }

        setUsers(data.data);
      } catch (error) {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return { users, loading };
};
