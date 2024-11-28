import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/components/SessionProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Tracker",
  description: "Track and manage employees across different locations",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Header />
          <main>{children}</main>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
