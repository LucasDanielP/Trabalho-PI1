import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Work & Rest",
  description: "Aplicação Pomodoro para gestão de tempo de estudo e foco.",
};

import FrameWrapper from "@/components/FrameWrapper";

import { AppProviders } from "@/components/providers/app-providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <AppProviders>
          <FrameWrapper>
            {children}
          </FrameWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
