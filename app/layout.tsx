import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/shell/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { loadDesk } from "@/lib/load";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Trade Vision",
    template: "%s · Trade Vision",
  },
  description:
    "Dual-book trading command center — Coins.ph and Gotrade, Manila desk.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const desk = loadDesk();

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${geistSans.className} min-h-full`}>
        <TooltipProvider>
          <AppShell stance={desk.stance} asOf={desk.asOf}>
            {children}
          </AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
