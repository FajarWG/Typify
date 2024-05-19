"use client";
import Sidebar, { SidebarItem } from "@/components/sidebar";
import { Earth, GraduationCap, Timer } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem
          text="Mengetik 10 Jari"
          icon={<GraduationCap size={60} />}
        />
        <SidebarItem text="Eksplorasi Budaya" icon={<Earth />} />
        <SidebarItem text="Tes Kecepatan" icon={<Timer />} />
      </Sidebar>
      <main className="h-full">{children}</main>
    </div>
  );
};

export default MarketingLayout;
