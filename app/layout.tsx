import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/nextjs";
import { localization } from "./localization";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Typify",
  description: "Typify adalah aplikasi pembelajaran mengetik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={localization}>
      <html lang="en">
        <body className={inter.className}>
          <NextUIProvider className=" bg-slate-100 text-black">
            {children}
          </NextUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
