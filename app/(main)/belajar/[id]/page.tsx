import Application from "@/components/organisims/learn/application";
import React from "react";

const page = ({ params }: any) => {
  const { id } = params;

  return <Application />;
};

export default page;
