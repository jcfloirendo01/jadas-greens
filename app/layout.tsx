import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import GSAPAnimations from "@/components/GSAPAnimations";
import MessengerChat from "@/components/MessengerChat";

export const metadata: Metadata = {
  title: "Jada's Greens — Hydroponically Grown Lettuce · Cabuyao, Laguna",
  description: "Fresh, pesticide-free hydroponic lettuce grown in Cabuyao, Laguna. Free delivery within Gran Seville Subdivision. ₱40/pc or 3 for ₱100.",
  icons: {
    icon: "/assets/logo-circle.png",
    apple: "/assets/logo-circle.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SmoothScroll />
        <GSAPAnimations />
        <Cursor />
        <PageTransitionWrapper />
        {children}
        <MessengerChat />
      </body>
    </html>
  );
}
