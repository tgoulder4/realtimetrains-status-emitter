
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster, toast } from 'sonner'
import { PHProvider } from './providers'
import { applicationStatus } from "@/app-config";
import { redirect } from "next/navigation";
import UnderMaintenancePage from "@/components/pages/UnderMaintenance";
const inter = Inter({ subsets: ["latin"] });

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
        <body className={inter.className + " bg-zinc-100 font-semibold"}>
          <Toaster className={inter.className} position="top-center" />
          {applicationStatus == "maintenance" ? <UnderMaintenancePage /> : children}
        </body>
      </PHProvider>
    </html>
  );
}
