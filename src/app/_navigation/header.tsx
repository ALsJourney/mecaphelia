"use client";
import { LucideKanban, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AccountDropdown } from "@/app/_navigation/account-dropdown";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath, signInPath, signUpPath } from "@/path";
import { navItems } from "@/app/_navigation/sidebar/constants";

import { ThemeSwitcher } from "../../components/theme/theme-switcher";
import { Button, buttonVariants } from "../../components/ui/button";
const Header = () => {
  const { user, isFetched } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isFetched) return null;

  const authButtons = user ? (
    <AccountDropdown user={user} />
  ) : (
    <>
      <Link
        href={{ pathname: signUpPath() }}
        className={buttonVariants({ variant: "default" })}
      >
        Sign Up
      </Link>
      <Link
        href={{ pathname: signInPath() }}
        className={buttonVariants({ variant: "outline" })}
      >
        Sign In
      </Link>
    </>
  );

  return (
    <>
      <nav
        className="animate-header-from-top supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-4 md:px-5 justify-between items-center"
      >
        <div className="flex items-center gap-x-2">
          <Link
            href={{ pathname: homePath() }}
            className={buttonVariants({ variant: "ghost" })}
          >
            <LucideKanban />
            <h1 className="hidden sm:inline">Mecaphelia</h1>
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <ThemeSwitcher />
          <div className="hidden sm:flex items-center gap-x-2">
            {authButtons}
          </div>
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-10 bg-background/95 backdrop-blur pt-16 sm:hidden">
          <div className="flex flex-col p-4 space-y-2">
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={buttonVariants({ variant: "ghost" }) + " justify-start gap-3 h-12"}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            <div className="border-t pt-4 mt-4 flex flex-col gap-2">
              {authButtons}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Header };
