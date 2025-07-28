
import type { Metadata } from "next";
import "./globals.css";
import { Toaster, } from 'sonner'
import { PHProvider } from './providers'
import { mainFont } from "@/lib/fonts";
import { Navbar } from "@/components/Navbar";

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
        <body className={mainFont.className + " bg-[#111111] text-white font-semibold w-full h-auto"}>
          <Toaster position="top-center" />
          <Navbar />
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
