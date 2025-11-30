import "./globals.css";

import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Header } from "@/app/_navigation/header";
import { Sidebar } from "@/app/_navigation/sidebar/components/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "The Road Next",
  description: "My Road to Next Appliaction...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <NuqsAdapter>
          <ThemeProvider>
            <Header />
            <div className="flex h-screen overflow-hidden border-collapse">
              <Sidebar />
              <main
                className="
                duration-200
                pl-[78px]
                peer-hover:pl-[240px]
                min-h-screen
                flex-1
                overflow-y-auto
                overflow-x-hidden
                py-24
                px-8
                bg-secondary/20
                flex flex-col
                "
              >
                {children}
              </main>
            </div>
            <Toaster expand />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
