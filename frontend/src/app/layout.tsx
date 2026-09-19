import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"], // Optical size for elegance
});

export const metadata: Metadata = {
  title: "SkillBridge | Evidence-based skill readiness",
  description: "An academia–industry skill readiness platform that assesses what students actually know.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-background text-ink`}
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
