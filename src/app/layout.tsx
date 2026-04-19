import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Rubic's Street",
  description:
    "An interactive 3D street scene inspired by Erno Rubik and the Mirror Cube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={caveat.variable}>
      <body>{children}</body>
    </html>
  );
}
