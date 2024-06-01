export const getUser = async () => {
  const dataUser = await fetch("/api/register", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return dataUser.json();
};
