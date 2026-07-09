import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { Navbar, Footer } from "@/components/shared";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inclusive E-Learning Platform",
  description: "Accessible learning environment for impaired learners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        We pass the Inter font class name here to ensure base typography loads.
        The AuthProvider stays high up so user state can be fetched globally.
      */}
      <body className={inter.className}>
        <AuthProvider>
          <AccessibilityProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}