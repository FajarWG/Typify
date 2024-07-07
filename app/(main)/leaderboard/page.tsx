"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab, User, Skeleton } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

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

  if (error) {
    return <p>{error}</p>;
  }

  const TableLevel = () => {
    return (
      <Table color={"primary"} aria-label="Table with selection mode">
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Akun</TableColumn>
          <TableColumn>EXP</TableColumn>
          <TableColumn>Level</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
            </TableRow>
          ) : (
            history.map((item: any, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <User
                    avatarProps={{
                      radius: "lg",
                      src: item.user.userImageSrc,
                    }}
                    description={item.user.username}
                    name={item.user.username}
                  >
                    {item.user.username}
                  </User>
                </TableCell>

                <TableCell className="font-semibold">
                  {item.user.exp_user}
                </TableCell>
                <TableCell className="font-semibold">
                  {item.user.level_user}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };
  const TableTyping = () => {
    return (
      <Table color={"primary"} aria-label="Table with selection mode">
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Akun</TableColumn>
          <TableColumn>KPM</TableColumn>
          <TableColumn>Akurasi</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded-lg" />
              </TableCell>
            </TableRow>
          ) : (
            history.map((item: any, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <User
                    avatarProps={{
                      radius: "lg",
                      src: item.user.userImageSrc,
                    }}
                    description={item.user.username}
                    name={item.user.username}
                  >
                    {item.user.username}
                  </User>
                </TableCell>

                <TableCell className="font-semibold">{item.wpm}</TableCell>
                <TableCell className="font-semibold">
                  {item.accuracy} %
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  let tabs = [
    {
      id: "level",
      label: "Level",
      content: <TableLevel />,
    },
    {
      id: "typingtest",
      label: "Typing Test",
      content: <TableTyping />,
    },
  ];

  return (
    <div className="flex w-full flex-col p-12">
      <h1 className="text-3xl text-center text-primary font-bold">
        Leaderboard
      </h1>
      <Tabs aria-label="Dynamic tabs" items={tabs} variant="bordered">
        {(item: any) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default TypingTestHistoryComponent;
