import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreatorConnect AI — The AI-Native Creator & Agency Marketplace",
  description:
    "Connect elite AI prompt directors, generative artists, and ComfyUI workflow engineers with global brands and creative agencies. Verified prompt receipts, smart briefs, and milestone escrow.",
  keywords: [
    "AI Creators",
    "Generative AI Marketplace",
    "Midjourney Artists",
    "ComfyUI Workflows",
    "Flux Creators",
    "Runway Gen-3",
    "Creative Agency Marketplace",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#0A0D14] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
