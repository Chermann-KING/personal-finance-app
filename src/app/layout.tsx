"use client";

// import type { Metadata } from "next";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Dashboard/Sidebar";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Personal Finance App",
//   description: "Personal budget management application",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();

  // Masquer la sidebar sur les pages d'authentification
  const showSidebar = !(
    pathname === "/auth/login" || pathname === "/auth/register"
  );
  return (
    <html lang="en">
      <body className={publicSans.className}>
        <div className="flex">
          {showSidebar && <Sidebar />}
          <main className="flex-grow bg-beige-100">{children}</main>
        </div>
      </body>
    </html>
  );
}
