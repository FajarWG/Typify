"use client";

import { UserButton } from "@clerk/nextjs";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar({ children }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen sticky top-0 z-50 border-r-2 border-primary">
      <nav
        className={`h-full flex flex-col bg-white border-r shadow-sm ${
          expanded ? "w-[256px]" : "w-[70px]"
        } `}
      >
        <div className=" mt-6  flex justify-between items-center">
          <Image
            src="/img/Typify.png"
            className={`overflow-hidden transition-all `}
            alt=""
            width={92}
            height={92}
          />
        </div>

        <ul className="flex-1 px-3">{children}</ul>

        <div className="border-t flex p-3 mx-auto">
          <UserButton />
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, link }: any) {
  return (
    <Link href={link}>
      <li
        className={`
        relative flex items-center py-2 px-3 my-1 mt-4
        font-medium rounded-md cursor-pointer
        transition-colors group 
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
      >
        {icon}
        <span className={`overflow-hidden transition-all w-0 h-0`}>{text}</span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 top-2`}
          />
        )}

        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6 text-nowrap
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      </li>
    </Link>
  );
}
