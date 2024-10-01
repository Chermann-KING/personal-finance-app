import type { Metadata } from "next";
import { ReactNode } from "react";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance App",
  description: "Personal budget management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={publicSans.className}>{children}</body>
    </html>
  );
}
