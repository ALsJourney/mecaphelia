import { LayoutDashboard, Car, Settings } from "lucide-react";

import { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard />,
    href: "/dashboard",
  },
  {
    title: "Meine Autos",
    icon: <Car />,
    href: "/cars",
  },
  {
    separator: true,
    title: "Einstellungen",
    icon: <Settings />,
    href: "/settings",
  },
];

export const closedClassName =
  "text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100";
