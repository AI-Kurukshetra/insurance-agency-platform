import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Insurance Agency Platform",
  description:
    "Production-ready insurance operations workspace for clients, policies, quotes, claims, commissions, and reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} bg-slate-50 text-slate-950 antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
