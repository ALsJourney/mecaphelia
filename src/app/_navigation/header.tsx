"use client";
import { LucideKanban } from "lucide-react";
import Link from "next/link";

import { AccountDropdown } from "@/app/_navigation/account-dropdown";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath, signInPath, signUpPath } from "@/path";

import { ThemeSwitcher } from "../../components/theme/theme-switcher";
import { buttonVariants } from "../../components/ui/button";
const Header = () => {
  const { user, isFetched } = useAuth();

  if (!isFetched) return null;

  const navItems = user ? (
    // <form action={signOut}>
    //   <SubmitButton label="Sign out" icon={<LucideLogOut />} />
    // </form>
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
    <nav
      className="
animate-header-from-top supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between
            "
    >
      <div className="flex align-items gap-x-2">
        <Link
          href={{ pathname: homePath() }}
          className={buttonVariants({ variant: "ghost" })}
        >
          <LucideKanban />
          <h1>TicketBounty</h1>
        </Link>
      </div>
      <div className="flex align-items gap-x-2">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
};

export { Header };
