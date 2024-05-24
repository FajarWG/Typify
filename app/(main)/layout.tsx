"use client";
import Sidebar, { SidebarItem } from "@/components/molecules/sidebar";
import UserCard from "@/components/molecules/userCard";
import { Earth, GraduationCap, Home, Timer } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="flex w-full">
      <Sidebar>
        <SidebarItem text="Dashboard" icon={<Home />} link="/dashboard" />
        <SidebarItem
          text="Mengetik 10 Jari"
          icon={<GraduationCap size={60} />}
          link="/belajar"
        />
        <SidebarItem
          text="Eksplorasi Budaya"
          icon={<Earth />}
          link="/explorasi"
        />
        <SidebarItem
          text="Tes Kecepatan"
          icon={<Timer />}
          link="/tes-mengetik"
        />
      </Sidebar>
      <main className="h-full w-full">{children}</main>
      <UserCard />
    </div>
  );
};

export default MarketingLayout;
