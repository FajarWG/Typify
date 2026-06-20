import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "@fontsource/opendyslexic/400.css";
import "@fontsource/opendyslexic/700.css";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { SettingsRoot } from "@/components/SettingsRoot";
import { SkipLink } from "@/components/SkipLink";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Typify",
  description: "A playful cultural touch-typing adventure for students worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SkipLink />
        <SettingsRoot />
        <I18nProvider>
          <main id="main" className="flex-1">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}