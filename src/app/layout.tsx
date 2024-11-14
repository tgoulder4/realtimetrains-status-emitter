
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster, toast } from 'sonner'
import { PHProvider } from './providers'
import { mainFont } from "@/lib/fonts";
import { DialogProvider } from "@/contexts/DialogContext";

export const metadata: Metadata = {
  title: "Beat The Euston Rush",
  description: "Be the first to know your train's platform at London Euston.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={mainFont.className + "  bg-zinc-100 dark:bg-[#111111] font-semibold w-full h-auto"}>
          <Toaster position="top-center" />
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
