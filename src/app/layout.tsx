import "./globals.css";

import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Header } from "@/app/_navigation/header";
import { Sidebar } from "@/app/_navigation/sidebar/components/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { cn } from "@/lib/utils";
import localFont from 'next/font/local'

export const metadata: Metadata = {
  title: "The Road Next",
  description: "My Road to Next Appliaction...",
};

const font = localFont({
  src: './../../public/League_Spartan/LeagueSpartan-VariableFont_wght.ttf',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();
  const isAuthenticated = Boolean(user);

  return (
    <html suppressHydrationWarning lang="en" className={font.className}>
      <body>
        <NuqsAdapter>
          <ThemeProvider>
            <Header />
            <div className="flex h-screen overflow-hidden border-collapse">
              <Sidebar />
              <main
                className={cn(
                  "duration-200 min-h-screen flex-1 overflow-y-auto overflow-x-hidden bg-secondary/20 flex flex-col",
                  isAuthenticated && "py-24 px-4 md:px-8 md:pl-[78px] md:peer-hover:pl-[240px]",
                  !isAuthenticated && "",
                )}
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
