import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { DemoAuthProvider } from "@/features/demo-auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({ subsets: ["latin"], variable: "--font-barlow", weight: ["500", "600", "700"] });

export const metadata: Metadata = { title: { default: "PitchSync", template: "%s · PitchSync" }, description: "Cricket administration and integrity management platform" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${barlow.variable}`}><DemoAuthProvider>{children}</DemoAuthProvider><Toaster richColors position="top-right" /></body></html>;
}
